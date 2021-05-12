const express = require('express');

const app = express();
const PORT = 3006;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>log-service home</h1>');
});

app.post('/array', (req, res) => {
    const arr = req.body.arr;
    console.log(arr);
    res.status(200).send('Array recieved');
});

app.listen(PORT, () => {
    console.log(`Server is up on http://localhost:${PORT}`);
});