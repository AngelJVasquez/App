const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { getUsers, saveUsers } = require('../utils/storage');
const { getLocalIP } = require('../utils/network');
const {
  validateEmail,
  validatePasswordMatch,
  validateUsername,
  validatePasswordStrength
} = require('../utils/validator');


function login(req, res) {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const match = bcrypt.compareSync(password, user.password);
  if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}


function getProfile(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = getUsers();
    const user = users.find(u => u.username === decoded.username);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ username: user.username, email: user.email });
  } catch {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}


function register(req, res) {
  const { username, email, password } = req.body;

  if (!validateUsername(username)) {
    return res.status(400).json({ error: 'Usuario inválido. Debe tener entre 3 y 20 caracteres, solo letras, números o guiones bajos.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Correo electrónico inválido.' });
  }

  if (!validatePasswordStrength(password)) {
    return res.status(400).json({ error: 'Contraseña débil. Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.' });
  }

  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'El usuario ya existe.' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  users.push({ username, email, password: hashed });
  saveUsers(users);

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token }); // ✅ acceso automático
}

function requestRecover(req, res) {
  const { email } = req.body;
  try {
    const users = getUsers();
    const user = users.find(u => u.email === email.trim().toLowerCase());
    if (!user) return res.status(404).json({ error: 'Correo no registrado' });

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const link = `http://${getLocalIP()}:${process.env.PORT}/?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
      tls:{
        rejectUnauthorized: false// ✅ permite certificados autofirmados
      }
    });

    const mailOptions = {
      from: `"Servicios Locales" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic para restablecer tu contraseña:</p><a href="${link}">${link}</a>`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error al enviar correo:', err); // 👈 clave para ver el error real
        return res.status(500).json({ error: 'Error al enviar correo' });
      }
      res.json({ message: 'Correo enviado' });
    });
  } catch (e) {
    console.error('Error en requestRecover:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}



function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = getUsers();
    const user = users.find(u => u.username === decoded.username);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    user.password = bcrypt.hashSync(newPassword, 10);
    saveUsers(users);

    const newToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.json({ token: newToken });
  } catch {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}


module.exports = {
  login,
  register,
  recoverPassword: () => {}, // opcional si no usas el flujo antiguo
  requestRecover,
  resetPassword,
  getProfile
};
