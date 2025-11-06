const Client = require('./ClientModel');

/**
 * @class ClientService
 * @typedef {ClientService}
 * @property {string} name - Nome do cliente obrigatório.
 * @property {string} email - E-mail do cliente obrigatório.
 * @property {boolean} activeClient - Flag de cliente ativo (padrão true).
 */

/**
 * @typedef {Object} ServiceResponse
 * @property {number} status - Código HTTP para resposta.
 * @property {Object|Array} data - Payload retornado.
 */

/**
 * Serviço responsável pela lógica de negócio de clientes.
 *
 * Regras:
 * - Não permite duplicação de e-mail (retorna 400).
 * - Exclusão é lógica (activeClient = false).
 * - Métodos retornam { status, data } para serem usados direto pelos Controllers.
 */
class ClientService {

    /**
     * Cria novo cliente.
     * Regras:
     * - Verifica se já existe cliente com mesmo email, se existir retorna status 400).
     * - Se não existir cria o usuário e retorna status 201.
     * Efeito:
     * - Persiste um novo registro na tabela `client`.
     *
     * @param {ClientPayload} data - Dados do cliente a ser criado.
     * @returns {ServiceResponse} - Resposta com status e dados de cliente criado ou erro.
     */
    async createClient(data) {
        try {
            const emailExistingClient = await Client.findOne({ where: { email: data.email } });
            if (emailExistingClient) {
                return {
                    status: 400,
                    data: { error: 'E-mail já cadastrado.' }
                };
            }

            const newClient = await Client.create(data);
            return {
                status: 201,
                data: newClient
            };

        } catch {
            return {
                status: 500,
                data: { error: 'Erro ao criar usuário.' }
            }
        }
    }


    /**
     * Lista clientes.
     * Lista todos os clientes cadastrado no banco de dados.
     *
     * @async
     * @param {ClientPayload} data - Dados do cliente a ser listado.
     * @returns {ServiceResponse} - Retorna os clientes ou erro.
     */
    async listClient(data) {
        try {
            const client = await Client.findAll(data);
            return {
                status: 200,
                data: client
            };

        } catch {
            return {
                status: 500,
                data: { message: 'Erro ao listar clientes.' }
            };
        }
    }


    /**
     * Busca cliente pelo ID.
     * Regras:
     * - Verifica se cliente cadastrado (retorna 404 se não).
     * - Se cliente cadastrado retorna os dados e status 200.
     * @async
     * @param {number} id - ID do cliente.
     * @returns {ServiceResponse} - Cliente encontrado ou mensagem de erro.
     */
    async listClientId(id) {
        try {
            const client = await Client.findByPk(id);

            if (!client) {
                return {
                    status: 404,
                    data: { message: `Cliente não encontrado com o ID: ${id}` }
                };
            }
            return {
                status: 200,
                data: client
            };
        } catch {
            return {
                status: 500,
                data: { message: 'Erro ao buscar cliente por ID,' }
            };
        }
    }

    /**
     * Atualiza cliente por ID.
     * Regras:
     * - Verifica se o cliente cadastrado (retorna 404 se não).
     * - Se cliente cadastrado, faz a alteração e retorna o usuário e status 200.
     * 
     * Efeito:
     * - Atualiza o registro no banco e salva updatedAt automaticamente (timestamps=true).
     * 
     * @param {number} id
     * @param {ClientPayload} clientData
     * @returns {ServiceResponse} - Cliente encontrado ou mensagem de erro.
     */
    async updateClintId(id, data) {
        try {
            const client = await Client.findByPk(id);

            if (!client) {
                return {
                    status: 404,
                    data: { message: `Cliente não encontrado com o id: ${id}` }
                };
            }
            await client.update(data);

            return {
                status: 200,
                data: { message: `Cliente atualizado com sucesso.`, updateClint: client }
            };

        } catch {
            return {
                status: 500,
                data: { message: 'Erro ao atulizar cliente.' }
            }
        }
    }

    /**
     * Deleção lógica do cliente, marca como inativo no banco.
     *
     * Regras:
     * - Verifica se o cliente cadastrado (retorna 404 se não).
     * - Não remove do Banco de Dados o registro altera o activeUser = false.
     *
     * Efeito:
     * - Faz a deleção lógica do cliente, mantendo histórico, pode ser vizualizado na requisição GET e Ativado com requisição PUT.
     *
     * @param {number} id - ID do cliente.
     * @returns {ServiceResponse} - Mensagem de sucesso e venda ou erro.
     */
    async deleteClientId(id) {
        try {
            const client = await Client.findByPk(id);

            if (!client) {
                return {
                    status: 404,
                    data: { message: `Cliente não encontrado com o id: ${id}` }
                };
            }
            client.activeClient = false;
            await client.save();

            return {
                status: 200,
                data: { message: 'Usuário deletado com sucesso.', deleteClient: client }
            };
        } catch {
            return {
                status: 500,
                data: { message: 'Erro ao deletar usuário.' }
            };
        }
    }

}

module.exports = new ClientService();