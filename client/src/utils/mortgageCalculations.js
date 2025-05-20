export const calculateMortgage = (loanAmount, interestRate, loanTerm) => {
  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
    return null; // Или throw new Error('Input values must be numbers');
  }

  if (loanAmount <= 0 || interestRate < 0 || loanTerm <= 0) {
    return null; // Или throw new Error('Input values must be positive numbers');
  }

  if (interestRate === 0) {
    const monthlyPayment = loanAmount / (loanTerm * 12);
    const totalAmountPaid = loanAmount;

     if (isNaN(monthlyPayment) || !Number.isFinite(monthlyPayment) || isNaN(totalAmountPaid) || !Number.isFinite(totalAmountPaid)) {
        return null; // Или throw new Error('Calculation resulted in NaN or Infinity for zero interest rate');
    }

    return {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalAmountPaid: parseFloat(totalAmountPaid.toFixed(2)),
    };
  }

  const monthlyInterestRate = interestRate / 12 / 100;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
  const totalAmountPaid = monthlyPayment * numberOfPayments;

   if (isNaN(monthlyPayment) || !Number.isFinite(monthlyPayment) || isNaN(totalAmountPaid) || !Number.isFinite(totalAmountPaid)) {
        return null; // Или throw new Error('Calculation resulted in NaN or Infinity');
    }


  return {
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    totalAmountPaid: parseFloat(totalAmountPaid.toFixed(2)),
  };
};