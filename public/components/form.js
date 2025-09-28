import { showModal } from './modal.js';

export function validateEmail(email) {
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

export function validatePasswordMatch(pass1, pass2) {
  return pass1 === pass2;
}

export function validateUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

export function validatePasswordStrength(password) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);
}
