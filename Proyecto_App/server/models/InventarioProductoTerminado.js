const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Produccion = require('./Produccion');

const InventarioProductoTerminado = sequelize.define('inventario_producto_terminado', {
    id_producto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_produccion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Produccion,
            key: 'id_produccion'
        }
    },
    cantidad_disponible: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'inventario_producto_terminado',
    timestamps: false
});

module.exports = InventarioProductoTerminado;

