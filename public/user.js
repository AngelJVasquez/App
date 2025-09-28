import { showModal, closeModal } from './components/modal.js';
import { getUserData, saveRoomName } from './components/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showModal('No has iniciado sesión');
    setTimeout(() => window.location.href = '/', 2000);
    return;
  }

  // Cargar datos del usuario
  const user = await getUserData();
  document.getElementById('userName').textContent = user.username;
  document.getElementById('navUserName').textContent = user.username;

 // Mostrar animación solo si no se ha mostrado antes
  const hasSeenWelcome = localStorage.getItem('welcomeShown');
  if (!hasSeenWelcome) {
    const welcome = document.getElementById('welcomeScreen');
    welcome.style.display = 'flex';

    document.getElementById('startBtn').onclick = () => {
      welcome.style.animation = 'fadeOut 1s forwards';
      setTimeout(() => welcome.remove(), 1000);
      localStorage.setItem('welcomeShown', 'true'); // ✅ marcar como mostrada
    };
  } else {
    // Si ya se mostró, eliminar directamente
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.remove();
  }

    // Toggle configuración
document.getElementById('configToggle').onclick = () => {
  const menu = document.getElementById('configMenu');
  menu.classList.toggle('hidden');
};

// Guardar sala
document.getElementById('saveRoom').onclick = async () => {
  const room = document.getElementById('roomName').value.trim();
  if (!room) return showModal('Ingresa un nombre de sala');
  await saveRoomName(room);
  showModal('Sala guardada correctamente');
};

// Cerrar sesión
document.getElementById('logout').onclick = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('welcomeShown'); // ✅ permitir animación en próxima sesión
  window.location.href = '/';
};

// Toggle chat
document.getElementById('chatToggle').onclick = () => {
  const chat = document.getElementById('chatContainer');
  chat.classList.toggle('hidden');
};

// Enviar mensaje
document.getElementById('sendChat').onclick = () => {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const chatBox = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.textContent = `Tú: ${msg}`;
  chatBox.appendChild(div);
  input.value = '';
};

  
  // Opcionales: si tienes estos elementos en el HTML
  const alertClose = document.getElementById('alertClose');
  if (alertClose) alertClose.onclick = () => closeModal();

  const logoutBtnAlt = document.getElementById('logoutBtn');
  if (logoutBtnAlt) {
    logoutBtnAlt.onclick = () => {
      localStorage.removeItem('token');
      showModal('Sesión cerrada');
      setTimeout(() => window.location.href = '/', 1500);
    };
  }
});
