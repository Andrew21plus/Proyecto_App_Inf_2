const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Rol = sequelize.define('rol', {
    id_rol: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_rol: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'rol',
    timestamps: false
});

module.exports = Rol;
