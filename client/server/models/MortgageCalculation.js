const mongoose = require('mongoose');

const mortgageCalculationSchema = new mongoose.Schema({
  loanAmount: {
    type: Number, // Или mongoose.Schema.Types.Decimal128
    required: true,
    min: 0,
  },
  interestRate: {
    type: Number, // Или mongoose.Schema.Types.Decimal128
    required: true,
    min: 0,
  },
  loanTerm: {
    type: Number,
    required: true,
    min: 1,
  },
  monthlyPayment: {
    type: Number, // Или mongoose.Schema.Types.Decimal128
    required: true,
    min: 0,
  },
  totalAmountPaid: {
    type: Number, // Или mongoose.Schema.Types.Decimal128
    required: true,
    min: 0,
  },
  email: {
    type: String,
    required: true,
    trim: true, // Удаление пробелов
    lowercase: true, // Приведение к нижнему регистру
    // Добавить валидацию email (regexp или использовать библиотеку validator)
  },
  createdAt: { type: Date, default: Date.now }
});

// Создание индекса для поля email
mortgageCalculationSchema.index({ email: 1 });
// Создание индекса для поля createdAt
mortgageCalculationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MortgageCalculation', mortgageCalculationSchema);