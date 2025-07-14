const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Servico = sequelize.define('Servico', {
  codigo_servico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  local: {
    type: DataTypes.STRING(100)
  },
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  forma_pagamento: {
    type: DataTypes.STRING(50)
  },
  status: {
    type: DataTypes.STRING(50)
  },
  codigo_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  codigo_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  observacoes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'servico',
  timestamps: false
});

module.exports = Servico;