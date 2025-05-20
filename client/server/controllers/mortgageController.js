const { calculateMortgage } = require('../utils/mortgageCalculations');
const { sendMortgageResultsEmail } = require('../utils/emailService');
const MortgageCalculation = require('../models/MortgageCalculation');
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

// Расчет ипотеки (с валидацией)
exports.calculateMortgage = [
    // xss(), // Санитизация - не нужна здесь, так как нет текстовых полей
    validate([
        body('loanAmount').isNumeric().isInt({ min: 1 }).withMessage('Сумма кредита должна быть числом больше 0.'),
        body('interestRate').isNumeric().isFloat({ min: 0 }).withMessage('Процентная ставка должна быть числом.'),
        body('loanTerm').isNumeric().isInt({ min: 1 }).withMessage('Срок кредита должен быть числом больше 0.')
    ]),
    async (req, res) => {
  try {
    const { loanAmount, interestRate, loanTerm } = req.body;
    const { monthlyPayment, totalAmountPaid } = calculateMortgage(loanAmount, interestRate, loanTerm);

    res.json({ monthlyPayment, totalAmountPaid });
  } catch (error) {
    console.error('Ошибка при расчете ипотеки', error); // Log the error object
    res.status(500).json({ message: 'Ошибка при расчете ипотеки.' });
  }
}];



// Отправка результатов на email
exports.sendResults = [
    xss(), // Санитизация
    validate([
        body('email').isEmail().withMessage('Необходимо указать действительный email.')
    ]),
    async (req, res) => {
  const { email, loanAmount, interestRate, loanTerm, monthlyPayment, totalAmountPaid } = req.body;
  const sanitizedEmail = validator.escape(email);

  try {
    await sendMortgageResultsEmail(sanitizedEmail, loanAmount, interestRate, loanTerm, monthlyPayment, totalAmountPaid);

    const newCalculation = new MortgageCalculation({
        loanAmount,
        interestRate,
        loanTerm,
        monthlyPayment,
        totalAmountPaid,
        email: sanitizedEmail
    });
    await newCalculation.save();

    res.status(200).json({ message: 'Результаты успешно отправлены на email.' });
  } catch (error) {
    console.error('Ошибка при отправке email', error); // Log the error object
    res.status(500).json({ message: 'Ошибка при отправке email. Обратитесь к администратору.' });
  }
}];