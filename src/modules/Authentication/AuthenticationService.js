const User = require('../user/UserModel');

/**
 * Middlewarw de autenticação Basic Auth.
 * 
 * Faz validação nas requisições HTTP e valida as credencias envidas no cabeçalho Authorization pelo Basic Auth.
 * 
 * - A autorização é no formato Authorization: Basic <base64(email e senha)>
 * - Decodifica o valor Base64 que é o email e senha do usuário.
 * - Verifica se o usuário está cadastrado no banco de dados.
 * - Faz a compração das credencias recebidas (email e senha) com as armazendas no banco de dados em texto puro.
 * - Se passado as credenciais CORRETAS, valida a requisição HTTP.
 * - Se passado as credenciáis INCORRETAS, retorna 401 com a mesnagem dependendo da verificação.
 * @async
 * @function basicAuth
 * @param {Request} req - Objeto da requisição HTTP contendo o header Authorization.
 * @param {Response} res - Objeto da resposta HTTP para enviar mensagens de erro.
 * @param {NextFunction} next - Se a autenticação for bem-sucedida, essa função chama o proximo middleware.
 * @returns - Retorna os status.
 */

//Middleware é uma função que recebe (req, res, next) e decide se chama next() (continua) ou responde ao cliente (bloqueia).
module.exports = async function basicAuth(req, res, next) {
    const authBasic = req.headers.authorization;    //Lê o header HTTP Authorization.

    //Verifica se foi selecionado "Basic Auth" no envio da requisição.
    if (!authBasic || !authBasic.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Autorização ausente ou invalida.' });
    }

    // Decodifica Base64 (email:senha)
    const decodeBase64 = authBasic.split(' ')[1];   //pega a parte Base64 do header (após "Basic ").
    const credentials = Buffer.from(decodeBase64, 'base64').toString('utf-8');  //decodifica para a string
    const [email, password] = credentials.split(':');   //Separa email e senha

    // Verifica usuário no Banco de Dados
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica senha texto puro no banco 
    const checkPassword = password === user.password;
    if (!checkPassword) {
        return res.status(401).json({ message: 'Senha incorreta.' });
    }

    req.user = user;
    next();
}