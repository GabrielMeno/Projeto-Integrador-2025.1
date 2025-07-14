const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Despesa = sequelize.define('Despesa', {
  codigo_despesa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false
  },
  observacoes: {
    type: DataTypes.TEXT
  },
  descricao: {
    type: DataTypes.TEXT
  },
  codigo_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'despesa',
  timestamps: false
});

module.exports = Despesa;
