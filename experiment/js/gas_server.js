/**
 * gas_server.js — Google Apps Script server code
 *
 * SETUP:
 *   1. Go to https://sheets.google.com and create a new spreadsheet
 *   2. Go to Extensions → Apps Script
 *   3. Replace the default code with this entire file
 *   4. Click Deploy → New Deployment
 *   5. Choose "Web app"
 *   6. Set "Execute as" → Me
 *   7. Set "Who has access" → Anyone
 *   8. Click Deploy and copy the URL
 *   9. Paste the URL into jsPsychSheet.js GAS_WEB_APP_URL
 *
 * This script handles two modes:
 *   - Full data dump: receives entire jsPsych JSON and writes all trials
 *   - Single row: receives one trial row at a time
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = data.sheetName || 'responses';

    // Get or create sheet
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    if (data.file) {
      // File upload mode: save scanned consent form to Drive
      // data.file = { name, mime, base64 }, data.participantId optional
      var folderName = 'consent_uploads';
      var folders = DriveApp.getFoldersByName(folderName);
      var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
      var bytes = Utilities.base64Decode(data.file.base64);
      var blob = Utilities.newBlob(bytes, data.file.mime || 'application/octet-stream',
        (data.participantId ? data.participantId + '_' : '') + data.file.name);
      var saved = folder.createFile(blob);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'ok',
        fileId: saved.getId()
      })).setMimeType(ContentService.MimeType.JSON);

    } else if (data.data) {
      // Full data dump mode: data.data is a JSON string of all trials
      var trials = JSON.parse(data.data);

      // Write headers if sheet is empty
      if (sheet.getLastRow() === 0 && trials.length > 0) {
        var headers = Object.keys(trials[0]);
        sheet.appendRow(headers);
      }

      // Write each trial as a row
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      for (var i = 0; i < trials.length; i++) {
        var row = headers.map(function(h) {
          var val = trials[i][h];
          if (typeof val === 'object') return JSON.stringify(val);
          return val !== undefined ? val : '';
        });
        sheet.appendRow(row);
      }

    } else if (data.row) {
      // Single row mode
      var row = data.row;

      // Write headers if sheet is empty
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(Object.keys(row));
      }

      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var rowData = headers.map(function(h) {
        var val = row[h];
        if (typeof val === 'object') return JSON.stringify(val);
        return val !== undefined ? val : '';
      });
      sheet.appendRow(rowData);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      rows: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Auto-assign sequential participant numbers (?action=next_pid)
  if (e && e.parameter && e.parameter.action === 'next_pid') {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var props = PropertiesService.getScriptProperties();
      var next = parseInt(props.getProperty('next_pid') || '1', 10);
      props.setProperty('next_pid', String(next + 1));
      return ContentService.createTextOutput(JSON.stringify({
        status: 'ok',
        pid: next
      })).setMimeType(ContentService.MimeType.JSON);
    } finally {
      lock.releaseLock();
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Prosodic Captioning Experiment — Data endpoint active'
  })).setMimeType(ContentService.MimeType.JSON);
}
