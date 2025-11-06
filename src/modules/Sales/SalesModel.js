const { DataTypes } = require('sequelize');
const sequelize = require('../../DataBase/DataBase');
const Client = require('../Client/ClientModel');


const Sales = sequelize.define('Sales', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nameProduct: {  //Nome do produto
        type: DataTypes.STRING,
        allowNull: false
    },

    quantityItems: {    //quantida de Itens
        type: DataTypes.INTEGER,
        allowNull: false
    },

    valueItem: {    // Valor unitário
        type: DataTypes.FLOAT,
        allowNull: false
    },

    totalValue: {   // Valor total
        type: DataTypes.FLOAT,
        allowNull: false
    },

    activeSales: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },

    clientId: { // FK para Cliente
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',   //nome da tabela no banco (clients)
            key: 'id'   //campo que será usado como chave (id)
        },
        onUpdate: 'CASCADE',    //se o id do cliente mudar, o campo clientId da venda é atualizado automaticamente.
        onDelete: 'SET NULL'    //se o cliente for removido, o clientId na venda é definido como NULL (não apaga a venda).
    }
},
    {
        tableName: 'sales',
        timestamps: true
    });

//Relacionamentos
Sales.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client'
});

Client.hasMany(Sales, {
    foreignKey: 'clientId',
    as: 'sales'
});

module.exports = Sales;