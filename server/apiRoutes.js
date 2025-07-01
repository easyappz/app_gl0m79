const express = require('express');
const { body, validationResult } = require('express-validator');

// Для работы с базой данных
const mongoDb = global.mongoDb;

const router = express.Router();

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculate
router.post('/calculate', [
  body('operation').isIn(['factorial', 'fibonacci', 'prime']).withMessage('Invalid operation'),
  body('number').isInt({ min: 0, max: 1000 }).withMessage('Number must be an integer between 0 and 1000')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { operation, number } = req.body;
  let result;

  try {
    switch (operation) {
      case 'factorial':
        result = calculateFactorial(number);
        break;
      case 'fibonacci':
        result = calculateFibonacci(number);
        break;
      case 'prime':
        result = calculateNthPrime(number);
        break;
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Calculation error', message: error.message });
  }
});

function calculateFactorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function calculateFibonacci(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

function calculateNthPrime(n) {
  const primes = [2];
  let num = 3;
  while (primes.length < n) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num += 2;
  }
  return primes[primes.length - 1];
}

function isPrime(num) {
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

module.exports = router;
