const express = require('express');
const fetch = require('node-fetch');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3005;

app.use(express.json());

const generateArray = (size) => {
    let arr = [], i = 0;
    while(i < size - 1) arr[i++] = size - i;
    return arr;
}

const sendData = async (num) => {
    const response = await fetch(process.env.LOG_SERVICE_PATH, {
        method: 'POST',
        body: JSON.stringify({ arr: generateArray(num) }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

app.get('/', (req, res) => {
    res.send('<h1>client-arrays-service home</h1>');
});

app.post('/set-number', async (req, res) => {
    const num = req.body.num;
    await sendData(num);
    res.send({msg: 'number received'});
})

io.on('connection', (socket) => {
    socket.join(socket.id);

    socket.on('set number', async (num, callback) => {
        let msg = '';
        const numericNum = Number(num);
        if(isNaN(numericNum)) {
            msg = 'input must be a number';
        } else if(numericNum % 1 !== 0) {
            msg = 'input must be an integer';
        } else if(numericNum < 1 || numericNum > 1000) {
            msg = 'input must be in range 1-1000';
        } else {
            await sendData(num);
            msg = generateArray(num);
        }

        callback({
            msg
        });
    })
  });

server.listen(PORT, () => {
    console.log(`Server is up on http://localhost:${PORT}`);
});