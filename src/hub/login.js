// Login_Screen: lógica pura (submitLogin) y DOM del formulario.
import { MESSAGES } from '../constants.js';

const ID_SCREEN = 'login-screen';
const ID_FORM = 'login-form';
const ID_USER = 'login-user';
const ID_PASS = 'login-pass';
const ID_ERROR = 'login-error';

// Pura, sin DOM -> { message, clearPassword, session }
export function submitLogin(auth, user, pass) {
  const result = auth.login(user, pass);
  if (result.ok) {
    return { message: '', clearPassword: false, session: user };
  }
  if (result.reason === 'empty') {
    return { message: MESSAGES.EMPTY_CREDENTIALS, clearPassword: false, session: null };
  }
  return { message: MESSAGES.INVALID_CREDENTIALS, clearPassword: true, session: null };
}

function getElements() {
  return {
    screen: document.getElementById(ID_SCREEN),
    form: document.getElementById(ID_FORM),
    user: document.getElementById(ID_USER),
    pass: document.getElementById(ID_PASS),
    error: document.getElementById(ID_ERROR),
  };
}

// Un solo contenedor role="alert": cada mensaje reemplaza al anterior
function setError(message) {
  getElements().error.textContent = message;
}

export function showLoginScreen() {
  getElements().screen.hidden = false;
}

export function hideLoginScreen() {
  getElements().screen.hidden = true;
}

// Vacía campos y error (tras cerrar sesión)
export function resetLoginScreen() {
  const { user, pass } = getElements();
  user.value = '';
  pass.value = '';
  setError('');
}

// onSuccess(userName) se llama cuando la sesión se ha creado
export function initLoginScreen(auth, onSuccess) {
  const { form, user, pass } = getElements();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    setError('');
    const result = submitLogin(auth, user.value, pass.value);
    if (result.session !== null) {
      onSuccess(result.session);
      return;
    }
    setError(result.message);
    if (result.clearPassword) pass.value = '';
  });

  user.addEventListener('input', () => setError(''));
  pass.addEventListener('input', () => setError(''));
}
