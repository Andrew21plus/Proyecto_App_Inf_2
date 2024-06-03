const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const InventarioMateriaPrima = sequelize.define('inventario_materia_prima', {
    id_materia_prima: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    proveedor: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cantidad_ingreso: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cantidad_disponible: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'inventario_materia_prima',
    timestamps: false
});

module.exports = InventarioMateriaPrima
