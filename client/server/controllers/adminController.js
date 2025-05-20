const MortgageCalculation = require('../models/MortgageCalculation');
const { sendAllCalculationsEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Invalid token:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Middleware для проверки роли администратора
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Unauthorized: Admin role required' });
    }
};

// Функция для пагинации
const getPagination = (page, limit) => {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const pageNumber = (!isNaN(parsedPage) && parsedPage > 0) ? parsedPage : 1;
    const limitNumber = (!isNaN(parsedLimit) && parsedLimit > 0) ? Math.min(parsedLimit, 100) : 10;

    const skip = (pageNumber - 1) * limitNumber;

    return { pageNumber, limitNumber, skip };
};

// Получение всех расчетов (с авторизацией и пагинацией)
exports.getCalculations = [authenticateToken, authorizeAdmin, async (req, res) => {
    const { pageNumber, limitNumber, skip } = getPagination(req.query.page, req.query.limit);

    try {
        const calculations = await MortgageCalculation.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalCalculations = await MortgageCalculation.countDocuments();
        const totalPages = Math.ceil(totalCalculations / limitNumber);

        res.json({
            calculations,
            page: pageNumber,
            totalPages,
            totalCalculations
        });
    } catch (error) {
        console.error('Ошибка при получении расчетов', error);
        res.status(500).json({ message: 'Ошибка при получении расчетов.' });
    }
}];

// Функция для проверки формата email (простая)
function isValidEmail(email) {
  return validator.isEmail(email);
}

// Отправка всех результатов (с авторизацией)
exports.sendAllResults = [authenticateToken, authorizeAdmin, xss(), async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Необходимо указать действительный email.' });
  }

  try {
      const calculations = await MortgageCalculation.find();
      await sendAllCalculationsEmail(email, calculations);
      res.status(200).json({ message: 'Все результаты отправлены на email.' });
  } catch (error) {
      console.error('Ошибка при отправке всех результатов', error);
      res.status(500).json({ message: 'Ошибка при отправке результатов. Обратитесь к администратору.' });
  }
}];