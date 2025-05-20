import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CarLoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculateMonthlyPayment = () => {
    if (!loanAmount || !interestRate || !loanTerm) {
      toast.error('Please fill in all fields.');
      return;
    }

    const principal = parseFloat(loanAmount);
    const interest = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12;

    if (isNaN(principal) || isNaN(interest) || isNaN(term)) {
      toast.error('Invalid input. Please enter numbers.');
      return;
    }

    const monthlyPayment = (principal * interest) / (1 - Math.pow(1 + interest, -term));

    setMonthlyPayment(monthlyPayment);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Автокредит Калькулятор
        </Typography>

        <TextField
          label="Сумма кредита"
          variant="outlined"
          margin="normal"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          fullWidth
        />
        <TextField
          label="Процентная ставка (%)"
          variant="outlined"
          margin="normal"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          fullWidth
        />
        <TextField
          label="Срок кредита (лет)"
          variant="outlined"
          margin="normal"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
          fullWidth
        />

        <Button variant="contained" color="primary" onClick={calculateMonthlyPayment} sx={{ mt: 2 }}>
          Рассчитать
        </Button>

        {monthlyPayment !== null && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">
              Ежемесячный платеж: {monthlyPayment.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
            </Typography>
          </Box>
        )}
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default CarLoanCalculator;