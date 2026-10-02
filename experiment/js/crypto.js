/**
 * crypto.js — Lightweight quiz answer encryption (matches Dynamik's approach)
 *
 * Encryption chain: plaintext → XOR(key) → Caesar(+7) → Base64
 * Applied to: correct answer indices, dummy flags
 */

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

export function encrypt(plaintext) {
  const json = typeof plaintext === 'string' ? plaintext : JSON.stringify(plaintext);
  return btoa(caesarShift(xorCipher(json, XOR_KEY), CAESAR_SHIFT));
}

export function decrypt(encoded) {
  try {
    const decoded = xorCipher(caesarShift(atob(encoded), -CAESAR_SHIFT), XOR_KEY);
    return JSON.parse(decoded);
  } catch {
    return atob(encoded);
  }
}
