const { Sequelize } = require('sequelize');

// Conexão direta com Postgres
const sequelize = new Sequelize('postgres', 'postgres', '2020', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false // Desativa logs SQL
});

sequelize.authenticate()
    .then(() => console.log('Conexão ao Banco reqlizada com Sucesso'))
    .catch(err => console.error('Erro ao conectar ao banco: ', err));

module.exports = sequelize;