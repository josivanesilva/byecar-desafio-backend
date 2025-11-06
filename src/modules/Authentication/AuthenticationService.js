const User = require('../user/UserModel');
//const bcrypt = require('bcrypt');


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