const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Produccion = sequelize.define('produccion', {
    id_produccion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fecha: {
        type: DataTypes.DATE,
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
