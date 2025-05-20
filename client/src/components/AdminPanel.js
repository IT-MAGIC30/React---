import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { CSVLink } from 'react-csv';
import { getToken } from '../utils/auth.js';

const baseURL = process.env.REACT_APP_API_BASE_URL || '';
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function AdminPanel() {
  const [calculations, setCalculations] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchCalculations = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getToken();
        const response = await api.get('/api/admin/calculations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCalculations(response.data);
      } catch (error) {
        console.error('Error fetching calculations:', error);
        setError('Failed to load calculations.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalculations();
  }, []);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendAllResults = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setEmailSent(false);
    try {
      const token = getToken();
      await api.post(
        '/api/admin/send-all-results',
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending all results:', error);
      setError('Failed to send email.');
    }
  };

  const csvData = calculations.map((calc) => ({
    'Дата расчета': new Date(calc.createdAt).toLocaleDateString(),
    'Сумма кредита': calc.loanAmount,
    'Процентная ставка': calc.interestRate,
    'Срок кредита (лет)': calc.loanTerm,
    'Ежемесячный платеж': calc.monthlyPayment,
    'Общая сумма выплат': calc.totalAmountPaid,
    'Email': calc.email,
  }));

    const csvHeaders = [
        { label: 'Дата расчета', key: 'Дата расчета' },
        { label: 'Сумма кредита', key: 'Сумма кредита' },
        { label: 'Процентная ставка', key: 'Процентная ставка' },
        { label: 'Срок кредита (лет)', key: 'Срок кредита (лет)' },
        { label: 'Ежемесячный платеж', key: 'Ежемесячный платеж' },
        { label: 'Общая сумма выплат', key: 'Общая сумма выплат' },
        { label: 'Email', key: 'Email' }
    ];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Админ панель
      </Typography>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Результаты расчетов:
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell scope="col">Дата расчета</TableCell>
                  <TableCell scope="col" align="right">Сумма кредита</TableCell>
                  <TableCell scope="col" align="right">Процентная ставка</TableCell>
                  <TableCell scope="col" align="right">Срок кредита (лет)</TableCell>
                  <TableCell scope="col" align="right">Ежемесячный платеж</TableCell>
                  <TableCell scope="col" align="right">Общая сумма выплат</TableCell>
                  <TableCell scope="col" align="right">Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculations.map((calc) => (
                  <TableRow key={calc._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {new Date(calc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">{calc.loanAmount}</TableCell>
                    <TableCell align="right">{calc.interestRate}</TableCell>
                    <TableCell align="right">{calc.loanTerm}</TableCell>
                    <TableCell align="right">{calc.monthlyPayment}</TableCell>
                    <TableCell align="right">{calc.totalAmountPaid}</TableCell>
                    <TableCell align="right">{calc.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <CSVLink data={csvData} headers={csvHeaders} filename={"mortgage-calculations.csv"} style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ mt: 2 }}>
              Экспорт расчетов в CSV
            </Button>
          </CSVLink>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Email Address"
              variant="outlined"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Button variant="contained" color="secondary" onClick={sendAllResults} sx={{ marginLeft: 1 }} disabled={emailSent}>
              Отправить все результаты на email
            </Button>
            {emailSent && <Typography sx={{ ml: 1, color: 'green' }}>Email sent successfully!</Typography>}
          </Box>
        </>
      )}
    </Container>
  );
}

export default AdminPanel;
