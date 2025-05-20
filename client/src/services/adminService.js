import axios from 'axios';
import { getToken } from '../utils/auth'; //  getToken функция.

const baseURL = process.env.REACT_APP_API_BASE_URL || '';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Таймаут 10 секунд
});

// Централизованная функция для обработки ошибок API
const handleApiError = (error, requestInfo) => {
    let errorMessage = 'Неизвестная ошибка';

    if (error.response) {
        errorMessage = `Ошибка API: ${error.response.status} - ${error.response.data.message || 'Неизвестная ошибка'} (URL: ${requestInfo.url}, Method: ${requestInfo.method})`;
        // Обработка 401 ошибки
        if (error.response.status === 401) {
            // TODO: Перенаправить пользователя на страницу входа или обновить токен
            console.warn('Unauthorized access. Redirecting to login or refreshing token.');
        }
    } else if (error.request) {
        errorMessage = `Нет ответа от сервера (URL: ${requestInfo.url}, Method: ${requestInfo.method})`;
    } else {
        errorMessage = `Ошибка при создании запроса: ${error.message} (URL: ${requestInfo.url}, Method: ${requestInfo.method})`;
    }

    console.error(errorMessage, error); // Логирование ошибки
    throw new Error(errorMessage);
};

const getCalculations = async () => {
    const requestInfo = { url: '/api/admin/calculations', method: 'GET' };
    try {
        const token = getToken(); //  getToken функция.

        const response = await api.get(requestInfo.url, {
            headers: {
                Authorization: `Bearer ${token}`, //  токен авторизации
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error, requestInfo);
    }
};

const sendAllCalculations = async (email) => {
    const requestInfo = { url: '/api/admin/send-all-results', method: 'POST' };
    try {
        const token = getToken(); //  getToken функция.

        await api.post(
            requestInfo.url,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`, //  токен авторизации
                },
            }
        );
    } catch (error) {
        handleApiError(error, requestInfo);
    }
};

export { getCalculations, sendAllCalculations };