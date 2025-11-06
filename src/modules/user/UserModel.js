const { DataTypes } = require('sequelize');
const sequelize = require('../../DataBase/DataBase');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false //Campo obrigatorio.
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false, //Campo obrigatorio.
    unique: true, //Não permite 2 email iguais.
    validate: {
      isEmail: true,  //Garante que o campo email sempre receba um valor válido antes de salvar no banco.
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false  //Campo obrigatorio.
  },
  
  activeUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, 
  {
    tableName: 'users',
    timestamps: true  //Ele = a true Cria automaticamente createdAt e updatedAt — ótimo para auditoria.
  }
);

module.exports = User;