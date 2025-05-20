/**
 * Рассчитывает ежемесячный платеж и общую сумму выплат по ипотеке.
 * @param {number} loanAmount Сумма кредита.
 * @param {number} interestRate Годовая процентная ставка (в процентах).
 * @param {number} loanTerm Срок кредита в годах.
 * @returns {object | null} Объект с результатами расчета или null в случае ошибки.
 */
const calculateMortgage = (loanAmount, interestRate, loanTerm) => {
  if (typeof loanAmount !== 'number' || isNaN(loanAmount) || loanAmount <= 0) {
    console.error('Invalid loanAmount:', loanAmount);
    return null;
  }

  if (typeof interestRate !== 'number' || isNaN(interestRate) || interestRate < 0) {
    console.error('Invalid interestRate:', interestRate);
    return null;
  }

  if (typeof loanTerm !== 'number' || isNaN(loanTerm) || loanTerm <= 0) {
    console.error('Invalid loanTerm:', loanTerm);
    return null;
  }

  if (interestRate === 0) {
    const monthlyPayment = loanAmount / (loanTerm * 12);
    const totalAmountPaid = loanAmount;

    return {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalAmountPaid: parseFloat(totalAmountPaid.toFixed(2)),
      totalInterestPaid: 0,
    };
  }

  const monthlyInterestRate = interestRate / 12 / 100;
  const numberOfPayments = loanTerm * 12;

  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

  const totalAmountPaid = monthlyPayment * numberOfPayments;
  const totalInterestPaid = totalAmountPaid - loanAmount;

  if (isNaN(monthlyPayment) || !Number.isFinite(monthlyPayment) || isNaN(totalAmountPaid) || !Number.isFinite(totalAmountPaid)) {
    console.error('Calculation resulted in NaN or Infinity');
    return null;
  }

  return {
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    totalAmountPaid: parseFloat(totalAmountPaid.toFixed(2)),
    totalInterestPaid: parseFloat(totalInterestPaid.toFixed(2)),
  };
};

export default calculateMortgage;