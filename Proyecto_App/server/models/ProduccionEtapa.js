const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Produccion = require('./Produccion');
const Etapa = require('./Etapa');

const ProduccionEtapa = sequelize.define('produccion_etapa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_produccion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produccion,
            key: 'id_produccion'
        }
    },
    id_etapa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Etapa,
            key: 'id_etapa'
        }
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: true
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: true
    },
    estado: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'produccion_etapa',
    timestamps: false
});

module.exports = ProduccionEtapa;
