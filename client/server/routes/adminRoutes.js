const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware'); // Подключаем middleware

// Middleware для логирования запросов
const logRequest = (req, res, next) => {
    console.log(`Admin route accessed: ${req.method} ${req.originalUrl}`);
    next();
};

// Маршруты с проверкой токена и прав администратора
// Получение всех расчетов (защищено)
router.get('/calculations', logRequest, authenticateToken, authorizeAdmin, adminController.getCalculations);

// Отправка всех результатов на email (защищено)
router.post('/send-all-results', logRequest, authenticateToken, authorizeAdmin, adminController.sendAllResults);

module.exports = router;