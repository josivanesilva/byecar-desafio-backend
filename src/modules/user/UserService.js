const User = require('./UserModel');

/**
 * @class UserService
 * @typedef {UserService}
 * @property {string} name - Nome do usuário obrigatório.
 * @property {string} email - E-mail único do usuário obrigatório.
 * @property {string} password - Senha do usuário obrigatório.
 * @property {boolean} [activeUser] - Flag de usuário ativo (padrão true).
 */

/**
 * @typedef {Object} ServiceResponse
 * @property {number} status - Código HTTP para resposta.
 * @property {Object|Array} data - Payload retornado.
 */

/**
 * Serviço responsável pela lógica de negócio relacionada a usuários.
 *
 * Regras:
 * - Impede criação de usuário com e-mail já cadastrado (retorna 400).
 * - A deleção é realiza exclusão lógica definindo activeUser = false.
 * - Os métodos capturam erros internos e retornam status.
 */
class UserService {

  /**
   * Cria novo usuário.
   * Regras:
   * - Verifica se já existe usuário com mesmo email, se existir retorna status 400).
   * - Se não existir cria o usuário e retorna status 201.
   * Efeito:
   * - Persiste um novo registro na tabela `users`.
   *
   * @param {UserPayload} data - Dados do usuário a ser criado.
   * @returns {ServiceResponse} - Resposta com status e dados de usuário criado ou erro.
   */
  async createUser(data) {
    try {
      const emailExistingUser = await User.findOne({ where: { email: data.email } });
      if (emailExistingUser) {
        return {
          status: 400,
          data: { error: 'E-mail já cadastrado.' }
        };
      }

      const newUser = await User.create(data);
      return {
        status: 201,
        data: newUser
      };

    } catch {
      return {
        status: 500,
        data: { error: 'Erro ao criar usuario.' }
      }
    }
  }

  /**
   * Lista usuários.
   * Lista todos os usuários cadastrado no banco de dados.
   *
   * @async
   * @param {UserPayload} data - Dados do usuário a ser listado.
   * @returns {ServiceResponse} - Retorna lista de usuários ou erro.
   */
  async listUsers(data) {
    try {
      const users = await User.findAll(data);
      return {
        status: 200,
        data: users
      };

    } catch {
      return {
        status: 500,
        data: { message: 'Erro ao Listar usuários.' }
      };
    }
  }

  /**
   * Busca um usuário pelo ID.
   * Regras:
   * - Verifica se o usuário cadastrado (retorna 404 se não).
   * - Se usuário cadastrado retorna o dados e status 200.
   * @async
   * @param {number} id - ID do usuário.
   * @returns {ServiceResponse} - Usuário encontrado ou mensagem de erro.
   */
  async listUsersId(id) {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        return {
          status: 404,
          data: { message: `Usuário não encontrado com o id: ${id}` }
        };
      }
      return {
        status: 200,
        data: user
      };
    } catch {
      return {
        status: 500,
        data: { message: 'Erro ao buscar usuário por ID.' }
      };
    }
  }

  /**
   * Atualiza usuário pelo ID.
   * Regras e validações:
   * - Verifica se o usuário cadastrado (retorna 404 se não).
   * - Se usuário cadastrado, faz a alteração e retorna o usuário e status 200.
   * 
   * Efeito:
   * - Atualiza o registro no banco e salva updatedAt automaticamente (timestamps=true).
   *
   * @param {number} id - ID do usuário a ser atualizado.
   * @param {UserPayload} data - Dados a atualizar.
   * @returns {Promise<ServiceResponse>} - Mensagem de sucesso e objeto atualizado, ou erro.
   */
  async updateUserId(id, data) {
    try {
      const updateUser = await User.findByPk(id);

      if (!updateUser) {
        return {
          status: 404,
          data: { message: `Usuário não encontrado com o id: ${id}` }
        };
      }
      await updateUser.update(data);

      return {
        status: 200,
        data: { message: 'Usuário atualizado com sucesso.', updateUser }
      };

    } catch {
      return {
        status: 500,
        data: { message: 'Erro ao atualizar usuário.' }
      };
    }
  }

  /**
   * Deleção lógica do usuário, marca como inativo no banco.
   *
   * Regras:
   * - Verifica se o usuário cadastrado (retorna 404 se não).
   * - Não remove do Banco de Dados o registro altera o activeUser = false.
   *
   * Efeito:
   * - Faz a deleção lógica do usário, mantendo histórico, pode ser vizualizado na requisição GET e Ativado com requisição PUT.
   *
   * @param {number} id - ID do usuário a ser deletado no banco.
   * @returns {ServiceResponse} - Mensagem de sucesso e usuário inativado, ou erro.
   */
  async deleteUserId(id) {
    try {
      const deleteUser = await User.findByPk(id);

      if (!deleteUser) {
        return {
          status: 404,
          data: { message: `Usuário não encontrado com o id: ${id}` }
        };
      }

      deleteUser.activeUser = false;
      await deleteUser.save();

      return {
        status: 200,
        data: { message: 'Usuário deletado com sucesso.', deleteUser }
      };

    } catch {
      return {
        status: 500,
        data: { message: 'Erro ao deletar usuário.' }
      };
    }
  }

}

module.exports = new UserService();
