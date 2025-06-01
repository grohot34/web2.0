const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

let array = Array.from({ length: 70 }, () => Math.floor(Math.random() * 41) + 10);

app.get('/data', (req, res) => {
  res.json(array);
});

app.get('/sorted', (req, res) => {
  const sorted = [...array].sort((a, b) => a - b);
  res.json({ sorted, min: Math.min(...sorted) });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});