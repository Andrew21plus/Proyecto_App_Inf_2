// models/ProduccionMateriaPrima.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class ProduccionMateriaPrima extends Model {}

ProduccionMateriaPrima.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_produccion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_materia_prima: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad_uso: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ProduccionMateriaPrima',
  tableName: 'produccion_materia_prima',
  timestamps: false
});

module.exports = ProduccionMateriaPrima;
