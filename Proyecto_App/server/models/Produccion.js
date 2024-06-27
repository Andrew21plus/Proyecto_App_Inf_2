// models/Produccion.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const ProduccionMateriaPrima = require('./ProduccionMateriaPrima');

class Produccion extends Model {}

Produccion.init({
  id_produccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Produccion',
  tableName: 'produccion',
  timestamps: false
});

Produccion.hasMany(ProduccionMateriaPrima, { as: 'materiasPrimas', foreignKey: 'id_produccion' });
ProduccionMateriaPrima.belongsTo(Produccion, { foreignKey: 'id_produccion' });

module.exports = Produccion;
