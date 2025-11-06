const app = require('./app');
const sequelize = require('./DataBase/DataBase');

// Importar Models (importação direta garante que o Sequelize os registre)
require('./modules/user/UserModel');
require('./modules/Client/ClientModel');
require('./modules/Sales/SalesModel');

// Cria as tabelas automaticamente
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
  })
  .catch(err => console.error('Erro ao sincronizar o banco:', err));
