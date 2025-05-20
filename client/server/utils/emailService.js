const nodemailer = require('nodemailer');

let transporter;

const createTransporter = async () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('EMAIL_USER и EMAIL_PASSWORD должны быть определены в переменных окружения.');
    }

    const newTransporter = nodemailer.createTransport({
        service: 'gmail', // или ваш SMTP-сервис
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        await newTransporter.verify();
        console.log('Сервер готов к отправке сообщений.');
        return newTransporter;
    } catch (error) {
        console.error('Ошибка при подключении к SMTP серверу:', error);
        throw error;
    }
};

const initializeTransporter = async () => {
    try {
        transporter = await createTransporter();
    } catch (error) {
        console.error('Ошибка при инициализации nodemailer:', error);
        // Можно попробовать пересоздать транспорт с экспоненциальной задержкой
        // или отправить уведомление администратору
        process.exit(1); // Завершаем процесс с кодом ошибки (или другая обработка)
    }
};

initializeTransporter();

exports.sendMortgageResultsEmail = async (email, loanAmount, interestRate, loanTerm, monthlyPayment, totalAmountPaid) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Результаты расчета ипотеки',
        html: `
      <p>Здравствуйте!</p>
      <p>Результаты вашего расчета ипотеки:</p>
      <ul>
        <li>Сумма кредита: ${loanAmount}</li>
        <li>Процентная ставка: ${interestRate}%</li>
        <li>Срок кредита: ${loanTerm} лет</li>
        <li>Ежемесячный платеж: ${monthlyPayment.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</li>
        <li>Общая сумма выплат: ${totalAmountPaid.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</li>
      </ul>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully', info); // Логируем информацию об отправке
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Пробрасываем ошибку
    }
};