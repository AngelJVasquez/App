import { validateEmail, validatePasswordMatch, validateUsername, validatePasswordStrength } from './components/form.js';

import { register } from './components/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Cierre de alerta
  document.getElementById('alertClose').onclick = () => closeModal();

  // Cierre dinámico de cualquier modal
  document.querySelectorAll('.close').forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.getAttribute('data-target') || btn.closest('.modal')?.id;
      if (targetId) closeModal(targetId);
    };
  });

  // Abrir login
  document.getElementById('openLogin').onclick = () => {
    closeAllModals();
    document.getElementById('loginModal').style.display = 'block';
  };

  // Abrir registro
  document.getElementById('openRegister').onclick = () => {
    closeAllModals();
    document.getElementById('registerModal').style.display = 'block';
  };

  // Cambiar de login a registro
  document.getElementById('switchToRegister').onclick = () => {
    closeModal('loginModal');
    document.getElementById('registerModal').style.display = 'block';
  };

  // Abrir recuperación
  document.getElementById('openRecover').onclick = () => {
    closeAllModals();
    document.getElementById('requestRecoverModal').style.display = 'block';
  };

  // Solicitar recuperación
  document.getElementById('submitRecoverRequest').onclick = async () => {
    const email = document.getElementById('recoverEmailOnly').value.trim();
    if (!email) return showModal('Ingresa tu correo');

    try {
      const res = await fetch('/api/request-recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        showModal('Revisa tu correo para continuar');
        closeModal('requestRecoverModal');
      } else {
        showModal(data.error || 'Correo no encontrado');
      }
    } catch {
      showModal('Error de conexión');
    }
  };

  // Detectar token en URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    localStorage.setItem('recoverToken', token);
    closeAllModals();
    document.getElementById('recoverModal').style.display = 'block';
  }

  // Enviar nueva contraseña
  document.getElementById('submitRecover').onclick = async () => {
    const newPassword = document.getElementById('recoverNewPass').value;
    const token = localStorage.getItem('recoverToken');

    if (!newPassword || !token) {
      showModal('Ingresa una nueva contraseña válida');
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        showModal('Contraseña actualizada. Bienvenido de nuevo');
        closeModal('recoverModal');
        setTimeout(() => window.location.href = '/user.html', 1500);
      } else {
        showModal(data.error || 'Token inválido o expirado');
      }
    } catch {
      showModal('Error de conexión');
    }
  };


  // Login
  document.getElementById('submitLogin').onclick = async () => {
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();

    if (!username || !password) {
      showModal('Completa usuario y contraseña');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        showModal(`Bienvenido, ${username}`);
        setTimeout(() => window.location.href = '/user.html', 1000);
      } else {
        showModal(data.error || 'Credenciales inválidas');
      }
    } catch {
      showModal('Error de conexión');
    }
  };

  // Registro
  document.getElementById('submitRegister').onclick = async () => {
  const username = document.getElementById('regUser').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass1 = document.getElementById('regPass1').value;
  const pass2 = document.getElementById('regPass2').value;

  // 🔍 Validaciones visuales
  if (!validateUsername(username)) {
    showModal('Usuario inválido. Usa entre 3 y 20 caracteres alfanuméricos o guiones bajos.');
    return;
  }

  if (!validateEmail(email)) {
    showModal('Correo electrónico inválido.');
    return;
  }

  if (!validatePasswordStrength(pass1)) {
    showModal('Contraseña débil. Usa al menos 8 caracteres, una mayúscula, una minúscula y un número.');
    return;
  }

  if (!validatePasswordMatch(pass1, pass2)) {
    showModal('Las contraseñas no coinciden.');
    return;
  }

  // ✅ Registro + login automático
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password: pass1 })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token); // ✅ guardar token
      showModal(`Bienvenido, ${username}`);
      closeModal('registerModal');
      setTimeout(() => window.location.href = '/user.html', 1000); // ✅ redirigir
    } else {
      showModal(data.error || 'Error al registrar');
    }
  } catch {
    showModal('Error de conexión');
  }
};

  // Logout
  document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('token');
    showModal('Sesión cerrada');
    setTimeout(() => location.reload(), 1500);
  };

  // Función auxiliar para cerrar todos los modales
  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  // Funciones de modal (puedes moverlas a modal.js si modularizas)
  function showModal(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('alertModal').style.display = 'block';
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
  }
});
