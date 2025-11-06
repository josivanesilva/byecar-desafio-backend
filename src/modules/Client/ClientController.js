const express = require('express');
const router = express.Router();
const basicAuth = require('../Authentication/AuthenticationService');
const ClientService = require('./ClientService');

/**
 * @file ClientController
 * @description Rotas HTTP para operações de Clientes.
 * Necessário autenticação por Basic Auth de email e senha na requisições.
 */

/**
 * @route POST /api/client
 * @summary Cria um cliente (protegido por Basic Auth).
 * @param {Object} req.body - { name, email }
 * @returns {201|400|500} - 201 Created com o Cliente criado, 400 E-mail já cadastrado ou 500 Erro ao criar usuário.
 */
router.post('/client', basicAuth, async (req, res) => {
    const result = await ClientService.createClient(req.body);
    res.status(result.status).json(result.data);
});

/**
 * @route GET /api/client
 * @summary Lista clientes (protegido por Basic Auth).
 * @returns {200|500} - 200 com os clientes ou 500 Erro ao listar clientes.
 */
router.get('/client', basicAuth, async (req, res) => {
    const result = await ClientService.listClient(req.body);

    res.status(result.status).json(result.data);
})

/**
 * @route GET /api/client/:id
 * @summary Busca cliente por ID (protegido por Basic Auth).
 * @param {string} req.params.id
 * @returns {200|404|500} - 200 com o Cliente, 404 Cliente não encontrado com o ID ou 500 Erro ao buscar cliente por ID.
 */
router.get('/client/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const result = await ClientService.listClientId(id);

    res.status(result.status).json(result.data);
})

/**
 * @route PUT /api/client/:id
 * @summary Atualiza cliente por ID (protegido por Basic Auth).
 * @param {string} req.params.id - ID do cliente
 * @param {Object} req.body
 * @returns {200|404|500} - 200 Cliente atualizado com sucesso, 404 Cliente não encontrado com o id ou 500 Erro ao atulizar cliente.
 */
router.put('/client/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const clientData = req.body;
    const result = await ClientService.updateClintId(id, clientData);

    res.status(result.status).json(result.data);
})

/**
 * @route DELETE /api/client/:id
 * @summary Exclusão lógica de cliente, marca activeUser=false (protegido por Basic Auth).
 * @returns {200|404|500} - 200 Usuário deletado com sucesso, 404 Cliente não encontrado com o id ou 500 Erro ao deletar usuário.
 */
router.delete('/client/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const result = await ClientService.deleteClientId(id);

    res.status(result.status).json(result.data);
})

module.exports = router;