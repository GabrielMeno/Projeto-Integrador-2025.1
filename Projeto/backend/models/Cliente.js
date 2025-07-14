const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Cliente = sequelize.define('Cliente', {
  codigo_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cpf_cnpj: {
    type: DataTypes.STRING(18),
    unique: true
  },
  telefone: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'cliente',
  timestamps: false
});

module.exports = Cliente;
