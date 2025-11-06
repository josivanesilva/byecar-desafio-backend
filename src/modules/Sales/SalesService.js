const Client = require('../Client/ClientModel');
const Sales = require('./SalesModel');

/**
 * @Class SalesService
 * @typedef {SalesService}
 * @property {string} nameProduct - Nome do produto obrigatório.
 * @property {number} quantityItems - Quantidade de itens obrigatório.
 * @property {number} valueItem - Valor unitário obrigatório.
 * @property {number} [totalValue] - Valor total opcional, será calculado automaticamente).
 * @property {number} clientId - ID do cliente obrigatório.
 * @property {boolean} activeSales - Flag da venda ativo (default true).
 */

/**
 * @typedef {Object} ServiceResponse
 * @property {number} status - Código HTTP para resposta.
 * @property {Object|Array} data - Payload retornado.
 */

/**
 * Service responsável pela lógica de negócio de vendas.
 *
 * Regras:
 * - Antes de criar a venda, valida existência e status ativo do cliente (se não existe retporna 404).
 * - Calcula (totalValue = quantityItems * valueItem) automaticamente no método "createSales" e no "updateSalesId".
 * - Exclusão lógica no Banco de Dados (activeSales = false).
 */
class SalesService {

    /**
     * Cria vendas.
     * 
     * Regras:
     * - Verifica se existe cliente salvo no banco e se ele está ativo (activeClient: true), se não existir retorna status 400).
     * - Se existir cria a venda e retorna status 201.
     * 
     * Efeito:
     * - Persiste um novo registro na tabela `sales`.
     * 
     * @param {SalesPayload} data - Dados da venda a ser criada.
     * @returns {ServiceResponse} - Resposta com status e dados da venda criada ou erro.
     */
    async createSales(data) {
        try {
            const { clientId, quantityItems, valueItem } = data;

            const clientExisting = await Client.findOne({ where: { id: clientId, activeClient: true } });

            if (!clientExisting) {
                return {
                    status: 404,
                    data: { message: `Usuário não encontrado com o id: ${clientId}, não é possível cadastrar a venda.` }
                };
            }

            data.totalValue = (Number(quantityItems) || 0) * (Number(valueItem) || 0);

            const newSales = await Sales.create({ 
                ...data 
             });

            return {
                status: 201,
                data: newSales
            };

        } catch(error) {
            return {
                status: 500,
                data: { error: error }
            }
        }
    }

    /**
     * Lista vendas.
     * Lista todas as vendas cadastradas no banco de dados.
     * 
     * @async
     * @param {ClientPayload} data - Dados das vendas a ser listada.
     * @returns {ServiceResponse} - Retorna os clientes ou erro.
     */
    async listSales(data) {
        try {
            const sales = await Sales.findAll(data);
            return {
                status: 200,
                data: sales
            };

        } catch {
            return {
                status: 500,
                data: { message: 'Erro ao listar vendas.' }
            };
        }
    }

    /**
     * Busca venda elo ID.
     * Regras:
     * - Verifica se venda cadastrada (retorna 404 se não).
     * - Se venda cadastrada retorna os dados e status 200.
     * @async
     * @param {number} id - ID da venda.
     * @returns {ServiceResponse} - Venda encontrada ou mensagem de erro.
     */
    async listSalesId(id) {
        try {
            const sales = await Sales.findByPk(id);

            if (!sales) {
                return {
                    status: 404,
                    data: { message: `Venda não encontrada com o id: ${id}` }
                };
            }
            return {
                status: 200,
                data: sales
            };

        } catch {
            return {
                status: 500,
                data: { message: 'Erro ao buscar vendas por Id. ' }
            };
        }
    }

    /**
     * Atualiza venda por ID. 
     * Regras:
     * - Verifica se a venda cadastrada (retorna 404 se não).
     * - Se venda cadastrada, faz a alteração e retorna a venda e status 200.
     * - Recalcula totalValue se quantityItems ou valueItem forem alterados.
     * 
     * Efeito:
     * - Atualiza o registro no banco e salva updatedAt automaticamente (timestamps=true).
     *
     * @param {number} id - ID da venda.
     * @param {SalesPayload} data - Dados das vendas a ser deletada.
     * @returns {ServiceResponse} - Venda encontrada ou mensagem de erro.
     */
    async updateSalesId(id, data) {
        try {
            const sales = await Sales.findByPk(id);

            if (!sales) {
                return {
                    status: 404,
                    data: { message: `Venda não encontrado com o id: ${id}` }
                };
            }

            let totalValue = sales.totalValue;
            if (data.quantityItems !== undefined || data.valueItem !== undefined) {
                const quantityItems = data.quantityItems ?? sales.quantityItems;
                const valueItem = data.valueItem ?? sales.valueItem;
                totalValue = (Number(quantityItems) || 0) * (Number(valueItem) || 0);
            }
            await sales.update({ ...data, totalValue });
            await sales.reload();

            return {
                status: 200,
                data: { message: 'Venda atualizada com sucesso.', updateSales: sales }
            };

        } catch {
            return {
                status: 500,
                data: { message: 'Erro ao atualizar venda.' }
            };
        }
    }

    /**
     * Deleção lógica da venda, marca como inativo no banco.
     * 
     * Regras:
     * - Verifica se a venda cadastrada (retorna 404 se não);
     * - Não remove do banco de dados o registro, altera o activeSales = false.
     * 
     * Efeito:
     * - Faz a deleção lógica da venda, mantendo histórico, pode ser vizualizado na requisição GET.
     * 
     * @async
     * @param {number} id - ID da venda
     * @returns {ServiceResponse} - Mensagem de sucesso e venda ou erro.
     */
    async deleteSalesId(id) {
        try {
            const sales = await Sales.findByPk(id);

            if (!sales || sales.activeSales === false) {
                return {
                    status: 404,
                    data: { message: `Venda não encontrada ou deletada, com o id: ${id}` }
                };
            }

            sales.activeSales = false;
            await sales.save();

            return {
                status: 200,
                data: { message: 'Venda deletada com sucesso.', deleteSales: sales }
            };

        } catch {
            return {
                status: 500,
                data: { message: 'Erro ao deletar venda.' }
            }
        }
    }
}

module.exports = new SalesService();