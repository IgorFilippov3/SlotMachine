const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const APP_PORT = 4200;

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/atlas', (req, res) => {
    fs.readFile(path.resolve(__dirname, './atlas/slot-machine-atlas.json'), 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(data);
    });
});

app.get('/reel-spin', (req, res) => {
    const extra = Math.floor(Math.random()*3);
    res.send({
        name: 'reel spin',
        extra: extra
    });
});

app.listen(APP_PORT, () => {
    console.log(`App is running on ${APP_PORT} port.`)
});