const calculateMortgage = async () => {
    setIsCalculating(true); // Включаем индикатор загрузки
    try {
      // ... ваш код расчета ипотеки ...
    } catch (error) {
      // ... обработка ошибок ...
    } finally {
      setIsCalculating(false); // Выключаем индикатор загрузки, независимо от результата
    }
  };
  
  // ... внутри вашего return (...) ...
  <Button variant="contained" color="primary" onClick={calculateMortgage} disabled={isCalculating}>
    {isCalculating ? 'Рассчитываем...' : 'Рассчитать'} {/* Отображать текст в зависимости от isCalculating */}
  </Button>