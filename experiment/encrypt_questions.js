#!/usr/bin/env node
/**
 * encrypt_questions.js
 *
 * Offline Node.js script to encrypt quiz correct answers.
 * Run: node encrypt_questions.js
 *
 * Reads all questions.json files and creates encrypted versions
 * where `correct` fields are encrypted. This prevents participants
 * from inspecting DevTools to find correct answers.
 */

const fs = require('fs');
const path = require('path');

// ── Encryption (must match js/crypto.js) ──────────────
const CAESAR_SHIFT = 7;
const XOR_KEY = 'prosodic2026';

function xorCipher(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function caesarShift(text, shift) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) + shift);
  }
  return result;
}

function encrypt(plaintext) {
  const json = typeof plaintext === 'string' ? plaintext : JSON.stringify(plaintext);
  return Buffer.from(caesarShift(xorCipher(json, XOR_KEY), CAESAR_SHIFT)).toString('base64');
}

// ── Process files ─────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const CONFIG_DIR = path.join(__dirname, 'config');

function encryptQuestionsFile(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const encrypted = JSON.parse(JSON.stringify(raw)); // deep copy

  // Encrypt comprehension correct answers
  if (encrypted.comprehension) {
    encrypted.comprehension.forEach(q => {
      q.correct_enc = encrypt(q.correct);
      delete q.correct;
    });
  }

  // Encrypt speaker_intent correct answers
  if (encrypted.speaker_intent) {
    for (const [key, task] of Object.entries(encrypted.speaker_intent)) {
      task.correct_enc = encrypt(task.correct);
      delete task.correct;
    }
  }

  return encrypted;
}

function processAllClips() {
  const clips = ['H1', 'H2', 'H3', 'L1', 'L2', 'L3', 'practice'];
  let processed = 0;

  clips.forEach(clip => {
    const qPath = path.join(DATA_DIR, clip, 'questions.json');
    if (!fs.existsSync(qPath)) {
      console.log(`  [SKIP] ${clip}: no questions.json`);
      return;
    }

    const encrypted = encryptQuestionsFile(qPath);

    // Write encrypted version to config dir
    const outPath = path.join(CONFIG_DIR, `quiz_${clip}.enc.json`);
    fs.writeFileSync(outPath, JSON.stringify(encrypted, null, 2), 'utf-8');
    console.log(`  [OK] ${clip}: ${outPath}`);
    processed++;
  });

  // Also encrypt pre-test questions
  const pretestPath = path.join(CONFIG_DIR, 'pretest_questions.json');
  if (fs.existsSync(pretestPath)) {
    const raw = JSON.parse(fs.readFileSync(pretestPath, 'utf-8'));
    const encrypted = JSON.parse(JSON.stringify(raw));
    encrypted.questions.forEach(q => {
      q.correct_enc = encrypt(q.correct);
      delete q.correct;
    });
    const outPath = path.join(CONFIG_DIR, 'pretest_questions.enc.json');
    fs.writeFileSync(outPath, JSON.stringify(encrypted, null, 2), 'utf-8');
    console.log(`  [OK] pretest: ${outPath}`);
    processed++;
  }

  return processed;
}

// ── Main ──────────────────────────────────────────────
console.log('Encrypting quiz answers...');
console.log(`  XOR key: "${XOR_KEY}"`);
console.log(`  Caesar shift: ${CAESAR_SHIFT}`);
console.log('');

const count = processAllClips();
console.log(`\nDone. ${count} files encrypted.`);
console.log('Use the .enc.json files in production and decrypt with js/crypto.js');
