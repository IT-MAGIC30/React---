const express = require('express');
const router = express.Router();
const mortgageController = require('../controllers/mortgageController');
const { body, validationResult } = require('express-validator'); // Для валидации
const xss = require('xss-clean'); // Для санитизации

// Middleware для валидации данных
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Маршрут для расчета ипотеки (с валидацией и санитизацией)
router.post('/calculate', xss(), validate([
    body('loanAmount').isNumeric().isInt({ min: 1 }).withMessage('Сумма кредита должна быть числом больше 0.'),
    body('interestRate').isNumeric().isFloat({ min: 0 }).withMessage('Процентная ставка должна быть числом.'),
    body('loanTerm').isNumeric().isInt({ min: 1 }).withMessage('Срок кредита должен быть числом больше 0.')
]), mortgageController.calculateMortgage);

// Маршрут для отправки результатов (с валидацией и санитизацией)
router.post('/send-results', xss(), validate([
    body('email').isEmail().withMessage('Необходимо указать действительный email.'),
    body('loanAmount').isNumeric().isInt({ min: 1 }).withMessage('Сумма кредита должна быть числом больше 0.'),
    body('interestRate').isNumeric().isFloat({ min: 0 }).withMessage('Процентная ставка должна быть числом.'),
    body('loanTerm').isNumeric().isInt({ min: 1 }).withMessage('Срок кредита должен быть числом больше 0.'),
    body('monthlyPayment').isNumeric().withMessage('Ежемесячный платеж должен быть числом.'),
    body('totalAmountPaid').isNumeric().withMessage('Общая сумма выплат должна быть числом.')
]), mortgageController.sendResults);

module.exports = router;