const TOKEN_KEY = 'token'; // Константа для ключа токена

export const getToken = () => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      console.warn('Attempted to get token on the server.');
      return null;
    }
  } catch (error) {
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (typeof window !== 'undefined') {
      if (typeof token === 'string' && token.length > 0) { //  Проверка типа и длины токена
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        console.warn('Attempted to set an invalid token:', token);
      }
    } else {
      console.warn('Attempted to set token on the server.');
    }
  } catch (error) {
    console.error('Error setting token in localStorage:', error);
  }
};

export const removeToken = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      console.warn('Attempted to remove token on the server.');
    }
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};
