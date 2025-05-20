import axios from 'axios';
import { getToken } from '../utils/auth';

const API_CALCULATE_MORTGAGE_URL = '/api/mortgage/calculate'; // Константа для URL
const baseURL = process.env.REACT_APP_API_BASE_URL || '';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Таймаут 10 секунд
});

const handleApiError = (error, requestInfo) => {
    let errorMessage = 'Неизвестная ошибка';

    if (error.response) {
        errorMessage = `Ошибка API: ${error.response.status} - ${error.response.data.message || 'Неизвестная ошибка'} (URL: ${requestInfo.url}, Method: ${requestInfo.method})`;
        // Обработка 401 ошибки
        if (error.response.status === 401) {
            // TODO: Перенаправить пользователя на страницу входа или обновить токен
            console.warn('Unauthorized access. Redirecting to login or refreshing token.');
            // Можно также выбросить ошибку, чтобы компонент знал, что нужно выполнить перенаправление
            // throw new Error('Unauthorized');
        }
    } else if (error.request) {
        errorMessage = `Нет ответа от сервера (URL: ${requestInfo.url}, Method: ${requestInfo.method})`;
    } else {
        errorMessage = `Ошибка при создании запроса: ${error.message} (URL: ${requestInfo.url}, Method: ${requestInfo.method})`;
    }

    console.error(errorMessage, error); // Логирование ошибки
    throw new Error(errorMessage);
};


const calculateMortgage = async (loanAmount, interestRate, loanTerm) => {
  const requestInfo = { url: API_CALCULATE_MORTGAGE_URL, method: 'POST' };
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated'); // Или перенаправить на страницу входа
    }

    const response = await api.post(requestInfo.url, {
      loanAmount,
      interestRate,
      loanTerm,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
     handleApiError(error, requestInfo);
  }
};

export default calculateMortgage;