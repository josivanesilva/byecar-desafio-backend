const express = require('express');
const app = express();

// Middleware para JSON
app.use(express.json());

// Importar controladores
const UserController = require('./modules/user/UserController');
const ClientController = require('./modules/Client/ClientController');
const SalesController = require('./modules/Sales/SalesController');

// Registrar rotas
app.use('/api', UserController);
app.use('/api', ClientController);
app.use('/api', SalesController);

module.exports = app;
