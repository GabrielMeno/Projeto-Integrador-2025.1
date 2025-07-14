const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Usuario = sequelize.define('Usuario', {
  codigo_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  login: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  perfil: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'usuario',
  timestamps: false
});

module.exports = Usuario;
