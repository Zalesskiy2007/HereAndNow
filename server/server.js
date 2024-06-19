import http from 'https';
import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import jwt from 'jsonwebtoken';
import { User } from './user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(morgan('combined'));
app.use(express.static('.'));
app.use(express.static('../client'));
app.use(express.static('../client/assets/fonts'));
app.use(express.static('../client/assets/images'));
app.use(express.static('../client/styles'));
app.use(express.static('../node_modules/maplibre-gl/dist'));

app.get('/login', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/register', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/map', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/friends', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/settings', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});

app.use('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/pageNotFound.html'));
});

const server = http.createServer(
    {
        key: fs.readFileSync('../cert/key.pem'),
        cert: fs.readFileSync('../cert/cert.pem')
    },
    app
);

const io = new Server(server);

mongoose.connect('mongodb://127.0.0.1:27017/HereAndNow');

io.on('connection', (socket) => {
    console.log(`Client connected with id: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected with id: ${socket.id}`);
    });
});

mongoose.connection.once('open', () => {
    console.log('Connected to database!');
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on port ${server.address().port} :)`);
    });
});
