// Auth_Service: validación simulada y sesión en sessionStorage. Sin red.
import { MOCK_CREDENTIALS, SESSION_KEY, SESSION_NAME_MAX } from '../constants.js';

const REASON_EMPTY = 'empty';
const REASON_INVALID = 'invalid';

// -> { ok, reason: 'empty' | 'invalid' | null }
export function validateCredentials(user, pass) {
  // Vacío: no se compara con las credenciales mock
  if (typeof user !== 'string' || typeof pass !== 'string' || user === '' || pass === '') {
    return { ok: false, reason: REASON_EMPTY };
  }
  if (user === MOCK_CREDENTIALS.user && pass === MOCK_CREDENTIALS.pass) {
    return { ok: true, reason: null };
  }
  return { ok: false, reason: REASON_INVALID };
}

function isValidSessionName(value) {
  return typeof value === 'string' && value.length >= 1 && value.length <= SESSION_NAME_MAX;
}

// Obtener sessionStorage puede lanzar (p. ej. cookies bloqueadas) o no existir (Node)
function getDefaultStorage() {
  try {
    return window.sessionStorage;
  } catch (error) {
    return null;
  }
}

export function createAuth(storage = getDefaultStorage()) {
  function removeSession() {
    try {
      storage.removeItem(SESSION_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    // -> { ok, reason }. Si ok, intenta guardar la sesión (si storage falla, el login sigue valiendo)
    login(user, pass) {
      const result = validateCredentials(user, pass);
      if (result.ok && isValidSessionName(user)) {
        try {
          storage.setItem(SESSION_KEY, user);
        } catch (error) {
          // Sin persistencia: se ignora
        }
      }
      return result;
    },

    // -> nombre (1..SESSION_NAME_MAX) | null. Elimina valores no válidos
    readSession() {
      let value;
      try {
        value = storage.getItem(SESSION_KEY);
      } catch (error) {
        return null;
      }
      if (value === null || value === undefined) return null;
      if (isValidSessionName(value)) return value;
      removeSession();
      return null;
    },

    // -> true si se eliminó; false si storage falló
    logout() {
      return removeSession();
    },
  };
}
