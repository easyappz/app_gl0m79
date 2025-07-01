import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const DisplayPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  textAlign: 'right',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  marginBottom: theme.spacing(2),
}));

const CalcButton = styled(Button)(({ theme, color }) => ({
  width: '100%',
  height: '60px',
  fontSize: '24px',
  borderRadius: '50%',
  backgroundColor: color === 'operator' ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.1)',
  color: color === 'operator' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: color === 'operator' ? theme.palette.primary.dark : 'rgba(255, 255, 255, 0.2)',
  },
}));

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return secondOperand !== 0 ? firstOperand / secondOperand : 'Error';
      default:
        return secondOperand;
    }
  };

  const handleKeyDown = (event) => {
    let { key } = event;

    if (key === 'Enter') key = '=';
    if ((/\d/).test(key)) {
      event.preventDefault();
      inputDigit(parseInt(key, 10));
    } else if (key in operators) {
      event.preventDefault();
      performOperation(key);
    } else if (key === '.') {
      event.preventDefault();
      inputDecimal();
    } else if (key === '%') {
      event.preventDefault();
      inputPercent();
    } else if (key === 'Backspace') {
      event.preventDefault();
      clear();
    } else if (key === 'Escape') {
      event.preventDefault();
      clear();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [display, firstOperand, operator, waitingForOperand]);

  const operators = {
    '/': '÷',
    '*': '×',
    '-': '-',
    '+': '+',
    '=': '=',
  };

  const CalculatorKey = ({ onPress, className, ...props }) => (
    <CalcButton
      variant="contained"
      onClick={onPress}
      color={className}
      {...props}
    />
  );

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 4 }}>
        <DisplayPaper elevation={3}>
          <Typography variant="h4">{display}</Typography>
        </DisplayPaper>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <CalculatorKey onPress={() => clear()} color="secondary">AC</CalculatorKey>
          </Grid>
          <Grid item xs={3}>
            <CalculatorKey onPress={() => toggleSign()} color="secondary">±</CalculatorKey>
          </Grid>
          <Grid item xs={3}>
            <CalculatorKey onPress={() => inputPercent()} color="secondary">%</CalculatorKey>
          </Grid>
          <Grid item xs={3}>
            <CalculatorKey onPress={() => performOperation('/')} color="operator">÷</CalculatorKey>
          </Grid>
          {[7, 8, 9].map((digit) => (
            <Grid item xs={3} key={digit}>
              <CalculatorKey onPress={() => inputDigit(digit)}>{digit}</CalculatorKey>
            </Grid>
          ))}
          <Grid item xs={3}>
            <CalculatorKey onPress={() => performOperation('*')} color="operator">×</CalculatorKey>
          </Grid>
          {[4, 5, 6].map((digit) => (
            <Grid item xs={3} key={digit}>
              <CalculatorKey onPress={() => inputDigit(digit)}>{digit}</CalculatorKey>
            </Grid>
          ))}
          <Grid item xs={3}>
            <CalculatorKey onPress={() => performOperation('-')} color="operator">-</CalculatorKey>
          </Grid>
          {[1, 2, 3].map((digit) => (
            <Grid item xs={3} key={digit}>
              <CalculatorKey onPress={() => inputDigit(digit)}>{digit}</CalculatorKey>
            </Grid>
          ))}
          <Grid item xs={3}>
            <CalculatorKey onPress={() => performOperation('+')} color="operator">+</CalculatorKey>
          </Grid>
          <Grid item xs={6}>
            <CalculatorKey onPress={() => inputDigit(0)}>0</CalculatorKey>
          </Grid>
          <Grid item xs={3}>
            <CalculatorKey onPress={() => inputDecimal()}>.</CalculatorKey>
          </Grid>
          <Grid item xs={3}>
            <CalculatorKey onPress={() => performOperation('=')} color="operator">=</CalculatorKey>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Calculator;