import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MyComponent from './components/MyComponent';
import MortgageCalculator from './components/MortgageCalculator';
import AdminPanel from './components/AdminPanel';
import CarLoanCalculator from './components/CarLoanCalculator';
import RetirementCalculator from './components/RetirementCalculator';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Ипотечный калькулятор</Link></li>
            <li><Link to="/car-loan">Автокредит</Link></li>
            <li><Link to="/retirement">Пенсионные накопления</Link></li>
            <li><Link to="/admin">Админ панель</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<MortgageCalculator />} />
          <Route path="/car-loan" element={<CarLoanCalculator />} />
          <Route path="/retirement" element={<RetirementCalculator />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        {/* MyComponent отображается на всех страницах */}
        <MyComponent />
      </div>
    </Router>
  );
}

export default App;