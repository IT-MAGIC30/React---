import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  calculateMortgage  from '../utils/calculateMortgage';
import axios from 'axios'; //  Импортируем axios


function MortgageCalculator() {
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanTerm, setLoanTerm] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState(null);
    const [totalAmountPaid, setTotalAmountPaid] = useState(null);
    const [email, setEmail] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const calculateMortgageHandler = async () => {
        if (!loanAmount || isNaN(loanAmount) || loanAmount <= 0) {
            toast.error('Пожалуйста, введите корректную сумму кредита.');
            return;
        }
        if (!interestRate || isNaN(interestRate) || interestRate < 0) {
            toast.error('Пожалуйста, введите корректную процентную ставку.');
            return;
        }
        if (!loanTerm || isNaN(loanTerm) || loanTerm <= 0) {
            toast.error('Пожалуйста, введите корректный срок кредита.');
            return;
        }

        setIsCalculating(true);
        try {
            const loanAmountValue = parseFloat(loanAmount);
            const interestRateValue = parseFloat(interestRate);
            const loanTermValue = parseInt(loanTerm, 10);

            const result = calculateMortgage(loanAmountValue, interestRateValue, loanTermValue);

            if (result) {
                setMonthlyPayment(result.monthlyPayment);
                setTotalAmountPaid(result.totalAmountPaid);
            } else {
                toast.error('Ошибка при расчете ипотеки. Пожалуйста, проверьте введенные данные.');
            }
        } catch (error) {
            console.error('Error calculating mortgage:', error);
            toast.error('Не удалось рассчитать ипотеку. Проверьте введенные данные.');
        } finally {
            setIsCalculating(false);
        }
    };

    const sendResults = async () => {
        setIsSending(true);
        try {
            await axios.post('/api/mortgage/send-results', { // Возможно, этот код нужно будет изменить
                email,
                loanAmount,
                interestRate,
                loanTerm,
                monthlyPayment,
                totalAmountPaid,
            });
            toast.success('Результаты отправлены на вашу почту!');
            setEmail('');
        } catch (error) {
            console.error('Error sending results:', error);
            toast.error('Ошибка при отправке результатов. Пожалуйста, проверьте адрес электронной почты.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ипотечный Калькулятор
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={calculateMortgageHandler} // Используем функцию для расчетов
                    disabled={isCalculating}
                >
                    {isCalculating ? 'Рассчитываем...' : 'Рассчитать'}
                </Button>

                {monthlyPayment && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6">Ежемесячный платеж: {monthlyPayment.toLocaleString('ru-RU', {
                            style: 'currency',
                            currency: 'RUB'
                        })}</Typography>
                        <Typography variant="h6">Общая сумма выплат: {totalAmountPaid.toLocaleString('ru-RU', {
                            style: 'currency',
                            currency: 'RUB'
                        })}</Typography>
                    </Box>
                )}

                <TextField
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={sendResults} //  Этот код нужно будет изменить
                    disabled={!monthlyPayment || isSending}
                    endIcon={<SendIcon />}
                >
                    {isSending ? 'Отправить результаты...' : 'Отправить результаты'}
                </Button>
            </Box>
            <ToastContainer />
        </Container>
    );
}

export default MortgageCalculator;