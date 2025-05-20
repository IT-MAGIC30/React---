/**
 * Функция для расчета ежемесячного платежа и общей суммы выплат по ипотеке.
 * @param {number} loanAmount - Сумма кредита.
 * @param {number} interestRate - Годовая процентная ставка (в процентах).
 * @param {number} loanTerm - Срок кредита (в годах).
 * @returns {object} - Объект, содержащий ежемесячный платеж и общую сумму выплат.
 */
exports.calculateMortgage = (loanAmount, interestRate, loanTerm) => {
  // Проверка входных данных
  if (typeof loanAmount !== 'number' || loanAmount <= 0) {
      throw new Error('Сумма кредита должна быть числом больше 0.');
  }
  if (typeof interestRate !== 'number' || interestRate < 0) {
      throw new Error('Процентная ставка должна быть числом больше или равна 0.');
  }
  if (typeof loanTerm !== 'number' || loanTerm <= 0) {
      throw new Error('Срок кредита должен быть числом больше 0.');
  }

  // Расчет ежемесячной процентной ставки
  const monthlyInterestRate = interestRate / 12 / 100;
  // Расчет количества платежей
  const numberOfPayments = loanTerm * 12;

  let monthlyPayment;
  // Если процентная ставка равна 0
  if (interestRate === 0) {
      monthlyPayment = loanAmount / numberOfPayments;
  } else {
      // Формула для расчета ежемесячного платежа по ипотеке
      monthlyPayment =
          (loanAmount * monthlyInterestRate) /
          (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
  }

  // Расчет общей суммы выплат
  const totalAmountPaid = monthlyPayment * numberOfPayments;

  return {
      // Округление до 2 знаков после запятой
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalAmountPaid: parseFloat(totalAmountPaid.toFixed(2)),
  };
};