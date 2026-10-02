/**
 * jsPsychSheet.js — Google Sheets data persistence via Google Apps Script
 *
 * Usage:
 *   1. Create a Google Sheet
 *   2. Go to Extensions → Apps Script
 *   3. Paste the GAS code from gas_server.js into the Apps Script editor
 *   4. Deploy as Web App (Anyone can access)
 *   5. Copy the Web App URL and set it below
 *
 * Integration with jsPsych:
 *   import { pushToSheet } from './jsPsychSheet.js';
 *   jsPsych.init({ on_finish: () => pushToSheet(jsPsych.data.get().json()) });
 */

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxmytkFZ_b_qGmOlVfqh3K4X2m3VxPVW09HdJnMGuc7mzLp_9NgfKNfjZPwc0okMPCa/exec';  // ← Set your Google Apps Script Web App URL here

/**
 * Push experiment data to Google Sheets via GAS Web App
 * @param {string} jsonData — JSON string from jsPsych.data.get().json()
 * @param {string} sheetName — Target sheet name (default: 'responses')
 * @returns {Promise<boolean>} — Success status
 */
export async function pushToSheet(jsonData, sheetName = 'responses') {
  if (!GAS_WEB_APP_URL) {
    console.warn('[jsPsychSheet] No GAS Web App URL configured. Data not sent.');
    return false;
  }

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',    // GAS requires no-cors from cross-origin pages
      headers: { 'Content-Type': 'text/plain' },  // must be simple header for no-cors
      redirect: 'follow',
      body: JSON.stringify({
        sheetName: sheetName,
        data: jsonData,
      }),
    });

    console.log('[jsPsychSheet] Data sent successfully');
    return true;
  } catch (error) {
    console.error('[jsPsychSheet] Failed to send data:', error);
    return false;
  }
}

/**
 * Fetch the next auto-assigned participant number from GAS.
 * Returns an integer, or null on failure (caller should fall back to manual entry).
 */
export async function getNextParticipantNum(timeoutMs = 5000) {
  if (!GAS_WEB_APP_URL) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`${GAS_WEB_APP_URL}?action=next_pid`, { signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(timer);
    const json = await res.json();
    return Number.isInteger(json.pid) ? json.pid : null;
  } catch (error) {
    console.warn('[jsPsychSheet] Auto participant number failed:', error);
    return null;
  }
}

/**
 * Upload a file (e.g. scanned consent form) to Drive via GAS Web App
 * @param {string} name — original filename
 * @param {string} mime — MIME type
 * @param {string} base64 — file content, base64 (no data: prefix)
 * @param {string} participantId — prepended to the stored filename
 */
export async function uploadFileToDrive(name, mime, base64, participantId = '') {
  if (!GAS_WEB_APP_URL) {
    console.warn('[jsPsychSheet] No GAS Web App URL configured. File not sent.');
    return false;
  }
  try {
    await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      redirect: 'follow',
      body: JSON.stringify({
        participantId,
        file: { name, mime, base64 },
      }),
    });
    console.log('[jsPsychSheet] File upload sent');
    return true;
  } catch (error) {
    console.error('[jsPsychSheet] File upload failed:', error);
    return false;
  }
}

/**
 * Push a single trial row to Google Sheets
 * @param {Object} trialData — Single trial data object
 * @param {string} sheetName — Target sheet name
 */
export async function pushTrialRow(trialData, sheetName = 'responses') {
  if (!GAS_WEB_APP_URL) return false;

  try {
    await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      redirect: 'follow',
      body: JSON.stringify({
        sheetName: sheetName,
        row: trialData,
      }),
    });
    return true;
  } catch (error) {
    console.error('[jsPsychSheet] Failed to push row:', error);
    return false;
  }
}
