const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Produccion = require('./Produccion');

const Inconveniente = sequelize.define('inconveniente', {
    id_inconveniente: {
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
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'inconveniente',
    timestamps: false
});

module.exports = Inconveniente;
