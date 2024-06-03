const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Produccion = require('./Produccion');
const Ventas = require('./Ventas');

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
    id_venta: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Ventas,
            key: 'id_venta'
        }
    },
    cantidad_disponible: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'inventario_producto_terminado',
    timestamps: false
});

module.exports = InventarioProductoTerminado;
