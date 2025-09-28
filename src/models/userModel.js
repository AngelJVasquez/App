const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../data/users.json');

function getUsers() {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

module.exports = { getUsers, saveUsers };
