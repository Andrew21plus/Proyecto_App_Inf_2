const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const InventarioMateriaPrima = require('./InventarioMateriaPrima');

const Produccion = sequelize.define('produccion', {
    id_produccion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_materia_prima: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: InventarioMateriaPrima,
            key: 'id_materia_prima'
        }
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cantidad_uso: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'produccion',
    timestamps: false
});

module.exports = Produccion;
