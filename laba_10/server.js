const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const originalFile = path.join(__dirname, 'original.txt');
const filteredFile = path.join(__dirname, 'filtered.txt');

app.post('/save', (req, res) => {
    const { text } = req.body;
    fs.writeFileSync(originalFile, text, 'utf8');
    res.json({ message: 'Text saved to original.txt' });
});

app.post('/filter', (req, res) => {
    const { option } = req.body;
    const lines = fs.readFileSync(originalFile, 'utf8').split('\n');

    let filteredLines = [];
    if (option === 'all') {
        filteredLines = lines;
    } else if (option === 'even') {
        filteredLines = lines.filter((_, i) => (i + 1) % 2 === 0);
    } else if (option === 'odd') {
        filteredLines = lines.filter((_, i) => (i + 1) % 2 !== 0);
    }

    fs.writeFileSync(filteredFile, filteredLines.join('\n'), 'utf8');
    res.json({ message: 'Filtered text saved to filtered.txt' });
});

app.get('/get-original', (req, res) => {
    const content = fs.readFileSync(originalFile, 'utf8');
    res.json({ content });
});

app.get('/get-filtered', (req, res) => {
    const content = fs.readFileSync(filteredFile, 'utf8');
    res.json({ content });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
