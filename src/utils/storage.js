const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/users.json');

function getUsers() {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

module.exports = {
  getUsers,
  saveUsers
};
