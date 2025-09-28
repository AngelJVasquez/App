require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getLocalIP } = require('./src/utils/network');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET no definido en .env');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./src/routes/authRoutes');
app.use('/api', authRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://${getLocalIP()}:${PORT}`);
});




