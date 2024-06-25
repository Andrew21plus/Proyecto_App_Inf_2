const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Produccion = require('./Produccion');
const InventarioMateriaPrima = require('./InventarioMateriaPrima');

const ProduccionMateriaPrima = sequelize.define('produccion_materia_prima', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_produccion: {
        type: DataTypes.INTEGER,
        references: {
            model: Produccion,
            key: 'id_produccion'
        }
    },
    id_materia_prima: {
        type: DataTypes.INTEGER,
        references: {
            model: InventarioMateriaPrima,
            key: 'id_materia_prima'
        }
    },
    cantidad_uso: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'produccion_materia_prima',
    timestamps: false
});

Produccion.belongsToMany(InventarioMateriaPrima, { through: ProduccionMateriaPrima, foreignKey: 'id_produccion' });
InventarioMateriaPrima.belongsToMany(Produccion, { through: ProduccionMateriaPrima, foreignKey: 'id_materia_prima' });

module.exports = ProduccionMateriaPrima;
