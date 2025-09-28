import { showModal, closeModal } from './modal.js';

/**
 * Inicia sesión con usuario y contraseña.
 * Guarda el token y redirige al panel de usuario.
 */
export async function login(username, password) {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/user.html'; // ✅ redirección automática
    } else {
      showModal(data.error || 'Credenciales inválidas');
    }
  } catch {
    showModal('Error de conexión');
  }
}

/**
 * Registra un nuevo usuario.
 * Guarda el token y redirige automáticamente.
 */
export async function register(data) {
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      localStorage.setItem('token', result.token); // ✅ guardar token
      showModal('Registro exitoso. Redirigiendo...');
      closeModal('registerModal');
      setTimeout(() => window.location.href = '/user.html', 1000); // ✅ redirigir
    } else {
      showModal(result.error || 'Error al registrar');
    }
  } catch {
    showModal('Error de conexión');
  }
}

/**
 * Obtiene los datos del usuario autenticado.
 * Devuelve { username, email } o 'Invitado' si falla.
 */
export async function getUserData() {
  try {
    const res = await fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('No autorizado');
    return await res.json();
  } catch {
    showModal('No se pudo cargar el usuario');
    return { username: 'Invitado' };
  }
}

/**
 * Guarda el nombre de la sala en la base de datos.
 */
export async function saveRoomName(room) {
  try {
    const res = await fetch('/api/save-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ room })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al guardar sala');
  } catch (err) {
    showModal(err.message);
  }
}
