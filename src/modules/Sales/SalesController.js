const express = require('express');
const router = express.Router();
const basicAuth = require('../Authentication/AuthenticationService');
const SalesService = require('./SalesService');

/**
 * @file SalesController
 * @description Rotas HTTP para operações de vendas.
 * Necessário autenticação por Basic Auth de email e senha na requisições.
 */

/**
 * @route POST /api/sales
 * @summary Cria uma venda (protegido por Basic Auth).
 * @param {Object} req.body - { nameProduct, quantityItems, valueItem, clientId }
 * @remarks - totalValue é calculado no Service como quantityItems * valueItem (regra de negócio).
 * @returns {201|404|500} - 201 Created com a venda criada, 404 Usuário não encontrado com o id ou 500 Erro ao criar venda.
 */
router.post('/sales', basicAuth, async (req, res) => {
    const result = await SalesService.createSales(req.body);
    res.status(result.status).json(result.data);
});

/**
 * @route GET /api/sales
 * @summary Lista vendas (protegido por Basic Auth).
 * @returns {200|500} - 200 com a venda ou 500 Erro ao listar vendas.
 */
router.get('/sales', basicAuth, async (req, res) => {
    const result = await SalesService.listSales(req.body);

    res.status(result.status).json(result.data);
});

/**
 * @route GET /api/sales/:id
 * @summary Busca venda por ID (protegido por Basic Auth).
 * @param {string} req.params.id - ID da venda.
 * @returns {200|404|500} - 200 com a venda, 404 Venda não encontrada com o id ou 500 Erro ao buscar vendas por Id.
 */
router.get('/sales/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const result = await SalesService.listSalesId(id);

    res.status(result.status).json(result.data);
});

/**
 * @route PUT /api/sales/:id
 * @summary Atualiza venda por ID (protegido por Basic Auth).
 * @param {string} req.params.id - ID da venda.
 * @param {Object} req.body - campos editáveis: nameProduct, quantityItems, valueItem, clientId.
 * @returns {200|404|500} - 200 Venda atualizada com sucesso, 404 Venda não encontrado com o id ou 500 Erro ao atualizar venda.
 */
router.put('/sales/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const sales = req.body;
    const result = await SalesService.updateSalesId(id, sales);

    res.status(result.status).json(result.data);
});

/**
 * @route DELETE /api/sales/:id
 * @summary Exclusão lógica de venda marca activeUser=false (protegido por Basic Auth).
 * @returns {200|404|500} - 200 Venda deletada com sucesso, 404 Venda não encontrada ou deletada, com o id ou 500 Erro ao deletar venda.
 */
router.delete('/sales/:id', basicAuth, async (req, res) => {
    const {id} = req.params;
    const result = await SalesService.deleteSalesId(id);

    res.status(result.status).json(result.data);
});

module.exports = router;