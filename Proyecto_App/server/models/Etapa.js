const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Etapa = sequelize.define('etapa', {
    id_etapa: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    etapa: { 
        type: DataTypes.TEXT,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'etapa',
    timestamps: false
});

module.exports = Etapa;
