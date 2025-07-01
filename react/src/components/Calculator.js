import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const CalculatorButton = styled(Button)(({ theme, color }) => ({
  width: '100%',
  height: '60px',
  borderRadius: '50%',
  fontSize: '1.8rem',
  fontWeight: '400',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  transition: 'background-color 0.3s, transform 0.1s',
  '&:active': {
    transform: 'scale(0.95)',
  },
  ...(color === 'operator' && {
    backgroundColor: '#ff9f0a',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#fbb03b',
    },
  }),
  ...(color === 'number' && {
    backgroundColor: '#333333',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#4d4d4d',
    },
  }),
  ...(color === 'function' && {
    backgroundColor: '#a5a5a5',
    color: '#000000',
    '&:hover': {
      backgroundColor: '#d4d4d2',
    },
  }),
}));

const Display = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'right',
  height: '120px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
}));

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (/[0-9]/.test(key)) {
        handleNumberClick(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperatorClick(key === '*' ? '×' : key === '/' ? '÷' : key);
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === '.') {
        handleDecimal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, operator, prevValue, waitingForOperand]);

  const handleNumberClick = (num) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperatorClick = (op) => {
    if (operator && !waitingForOperand) {
      calculate();
    } else if (!waitingForOperand) {
      setPrevValue(parseFloat(display));
    }
    setOperator(op);
    setWaitingForOperand(true);
  };

  const calculate = () => {
    const current = parseFloat(display);
    let result;
    switch (operator) {
      case '+':
        result = prevValue + current;
        break;
      case '-':
        result = prevValue - current;
        break;
      case '×':
        result = prevValue * current;
        break;
      case '÷':
        if (current === 0) {
          setDisplay('Error');
          setPrevValue(null);
          setOperator(null);
          setWaitingForOperand(true);
          return;
        }
        result = prevValue / current;
        break;
      default:
        return;
    }
    setDisplay(result.toString());
    setPrevValue(result);
    setOperator(null);
  };

  const handleEquals = () => {
    if (!operator) return;
    calculate();
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    if (operator && prevValue !== null) {
      const percentValue = (prevValue * current) / 100;
      setDisplay(percentValue.toString());
      setWaitingForOperand(false);
    } else {
      setDisplay((current / 100).toString());
    }
  };

  const handlePlusMinus = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <Box sx={{ maxWidth: 300, margin: 'auto', mt: 4, backgroundColor: '#000000', borderRadius: '16px', padding: '20px' }}>
      <Display>
        <Typography variant="h2" sx={{ fontSize: '3rem', color: '#ffffff' }}>{display}</Typography>
      </Display>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <CalculatorButton color="function" onClick={handleClear}>AC</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton color="function" onClick={handlePlusMinus}>+/-</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton color="function" onClick={handlePercent}>%</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton color="operator" onClick={() => handleOperatorClick('÷')}>÷</CalculatorButton>
        </Grid>
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <Grid item xs={3} key={num}>
            <CalculatorButton color="number" onClick={() => handleNumberClick(num.toString())}>{num}</CalculatorButton>
          </Grid>
        ))}
        <Grid item xs={3}>
          <CalculatorButton color="operator" onClick={() => handleOperatorClick('×')}>×</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton color="operator" onClick={() => handleOperatorClick('-')}>-</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton color="operator" onClick={() => handleOperatorClick('+')}>+</CalculatorButton>
        </Grid>
        <Grid item xs={6}>
          <CalculatorButton color="number" onClick={() => handleNumberClick('0')} sx={{ borderRadius: '30px', width: '100%', justifyContent: 'flex-start', paddingLeft: '25px' }}>0</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton color="number" onClick={handleDecimal}>.</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton color="operator" onClick={handleEquals}>=</CalculatorButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calculator;
