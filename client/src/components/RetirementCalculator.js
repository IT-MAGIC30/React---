import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [retirementIncomeGoal, setRetirementIncomeGoal] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState(null);

  const calculateMonthlyContribution = () => {
    if (!currentAge || !retirementAge || !currentSavings || !annualIncome || !retirementIncomeGoal) {
      toast.error('Пожалуйста, заполните все поля.');
      return;
    }

    const age = parseInt(currentAge);
    const retireAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings);
    const income = parseFloat(annualIncome);
    const goal = parseFloat(retirementIncomeGoal);

    if (isNaN(age) || isNaN(retireAge) || isNaN(savings) || isNaN(income) || isNaN(goal)) {
      toast.error('Неверный ввод. Пожалуйста, введите числа.');
      return;
    }

    if (retireAge <= age) {
      toast.error('Возраст выхода на пенсию должен быть больше текущего возраста.');
      return;
    }

    // Упрощенная формула расчета (требует доработки с учетом инфляции, доходности инвестиций и т.д.)
    const yearsToRetirement = retireAge - age;
    const totalNeeded = goal * yearsToRetirement;
    const remainingNeeded = totalNeeded - savings;
    const monthlyContributionNeeded = remainingNeeded / (yearsToRetirement * 12);

    setMonthlyContribution(monthlyContributionNeeded);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Калькулятор Пенсионных Накоплений
        </Typography>

        <TextField
          label="Текущий возраст"
          variant="outlined"
          margin="normal"
          value={currentAge}
          onChange={(e) => setCurrentAge(e.target.value)}
          fullWidth
        />
        <TextField
          label="Возраст выхода на пенсию"
          variant="outlined"
          margin="normal"
          value={retirementAge}
          onChange={(e) => setRetirementAge(e.target.value)}
          fullWidth
        />
        <TextField
          label="Текущие сбережения"
          variant="outlined"
          margin="normal"
          value={currentSavings}
          onChange={(e) => setCurrentSavings(e.target.value)}
          fullWidth
        />
        <TextField
          label="Годовой доход"
          variant="outlined"
          margin="normal"
          value={annualIncome}
          onChange={(e) => setAnnualIncome(e.target.value)}
          fullWidth
        />
        <TextField
          label="Желаемый годовой доход на пенсии"
          variant="outlined"
          margin="normal"
          value={retirementIncomeGoal}
          onChange={(e) => setRetirementIncomeGoal(e.target.value)}
          fullWidth
        />

        <Button variant="contained" color="primary" onClick={calculateMonthlyContribution} sx={{ mt: 2 }}>
          Рассчитать
        </Button>

        {monthlyContribution !== null && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">
              Ежемесячный взнос: {monthlyContribution.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
            </Typography>
          </Box>
        )}
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default RetirementCalculator;