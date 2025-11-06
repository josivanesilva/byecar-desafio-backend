const express = require('express');
const router = express.Router();
const basicAuth = require('../Authentication/AuthenticationService');
const UserService = require('./UserService');

/**
 * @file UserController
 * @description Rotas HTTP para operações relacionadas a usuários.
 * Necessário autenticação por Basic Auth de email e senha na requisições.
 */

/**
 * @route POST /api/users
 * @summary Cria um novo usuário (público).
 * @param {Object} req.body - { name, email, password }
 * @returns {201|400|500} - 201 Created com o usuário criado, 400 se e-mail já cadastrado ou 500 Erro ao criar usuario.
 */
router.post('/users', async (req, res) => {
    const result = await UserService.createUser(req.body);
    res.status(result.status).json(result.data);
});

/**
 * @route GET /api/users
 * @summary Lista usuários (protegido por Basic Auth).
 * @security BasicAuth
 * @returns {200|500} - 200 com os usuários ou 500 Erro ao Listar usuários.
 */
router.get('/users', basicAuth, async (req, res) => {
    const result = await UserService.listUsers(req.body);

    res.status(result.status).json(result.data);
});

/**
 * @route GET /api/users/:id
 * @summary Busca usuário por ID (protegido por Basic Auth).
 * @param {string} req.params.id - ID do usuário.
 * @returns {200|404|500} - 200 com o usuário, 404 se não encontrado ou 500 Erro ao buscar usuário por ID.
 */
router.get('/users/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const result = await UserService.listUsersId(id);

    res.status(result.status).json(result.data);
});

/**
 * @route PUT /api/users/:id
 * @summary Atualiza usuário por ID (protegido por Basic Auth).
 * @param {string} req.params.id
 * @param {Object} req.body - campos a ser atualizado.
 * @returns {200|404|500} - 200 com o usuário, 404 se não encontrado ou 500 erro ao atualizar usuário.
 */
router.put('/users/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const userData = req.body;
    const result = await UserService.updateUserId(id, userData);

    res.status(result.status).json(result.data);
});


/**
 * @route DELETE /api/users/:id
 * @summary Exclusão lógica de usuário, marca activeUser=false (protegido por Basic Auth).
 * @returns {200|404|500} - 200 Usuário deletado com sucesso, 404 Usuário não encontrado com o id ou 500 Erro ao deletar usuário.
 */
router.delete('/users/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const result = await UserService.deleteUserId(id);

    res.status(result.status).json(result.data);
});

module.exports = router;