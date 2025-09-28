function validateEmail(email) {
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

function validatePasswordMatch(pass1, pass2) {
  return pass1 === pass2;
}

function validateUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function validatePasswordStrength(password) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);
}

module.exports = {
  validateEmail,
  validatePasswordMatch,
  validateUsername,
  validatePasswordStrength
};
