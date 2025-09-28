export function showModal(message) {
  document.getElementById('alertMessage').textContent = message;
  document.getElementById('alertModal').style.display = 'flex';
}

export function closeModal(id = 'alertModal') {
  document.getElementById(id).style.display = 'none';
}
