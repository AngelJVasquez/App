const express = require('express');
const router = express.Router();
const {
  login,
  register,
  recoverPassword,
  requestRecover,
  resetPassword,
  getProfile
} = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/recover', recoverPassword);
router.post('/request-recover', requestRecover);
router.post('/reset-password', resetPassword);
router.get('/me', getProfile);


module.exports = router;


