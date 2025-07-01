import React, { useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const CalculatorButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  '&.operator': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '&.number': {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.grey[700],
    },
  },
  '&.function': {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.common.black,
    '&:hover': {
      backgroundColor: theme.palette.grey[500],
    },
  },
}));

const Display = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'right',
}));

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);

  const handleNumberClick = (num) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperatorClick = (op) => {
    if (prevValue === null) {
      setPrevValue(parseFloat(display));
      setDisplay('0');
    } else {
      calculate();
    }
    setOperator(op);
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
    if (operator) {
      calculate();
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setOperator(null);
    setPrevValue(null);
  };

  const handlePercent = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  const handlePlusMinus = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <Box sx={{ maxWidth: 300, margin: 'auto', mt: 4 }}>
      <Display>
        <Typography variant="h4">{display}</Typography>
      </Display>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <CalculatorButton className="function" onClick={handleClear}>AC</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton className="function" onClick={handlePlusMinus}>+/-</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton className="function" onClick={handlePercent}>%</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton className="operator" onClick={() => handleOperatorClick('÷')}>÷</CalculatorButton>
        </Grid>
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <Grid item xs={3} key={num}>
            <CalculatorButton className="number" onClick={() => handleNumberClick(num.toString())}>{num}</CalculatorButton>
          </Grid>
        ))}
        <Grid item xs={3}>
          <CalculatorButton className="operator" onClick={() => handleOperatorClick('×')}>×</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton className="operator" onClick={() => handleOperatorClick('-')}>-</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton className="operator" onClick={() => handleOperatorClick('+')}>+</CalculatorButton>
        </Grid>
        <Grid item xs={6}>
          <CalculatorButton className="number" onClick={() => handleNumberClick('0')}>0</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton className="number" onClick={handleDecimal}>.</CalculatorButton>
        </Grid>
        <Grid item xs={3}>
          <CalculatorButton className="operator" onClick={handleEquals}>=</CalculatorButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calculator;
