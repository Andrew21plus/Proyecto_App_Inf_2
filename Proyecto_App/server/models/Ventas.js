const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Usuario = require('./Usuario');

const Ventas = sequelize.define('ventas', {
    id_venta: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'ventas',
    timestamps: false
});

module.exports = Ventas;

