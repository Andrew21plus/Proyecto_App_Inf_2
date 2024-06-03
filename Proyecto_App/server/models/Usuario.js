const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Rol = require('./Rol');

const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Rol,
            key: 'id_rol'
        }
    },
    cedula: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    nombre_usuario: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    apellido_usuario: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contrasena: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telefono: {
        type: DataTypes.NUMERIC,
        allowNull: true
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

module.exports = Usuario;
