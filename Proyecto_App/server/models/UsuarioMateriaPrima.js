const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Usuario = require('./Usuario');
const InventarioMateriaPrima = require('./InventarioMateriaPrima');

const UsuarioMateriaPrima = sequelize.define('usuario_materia_prima', {
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        },
        primaryKey: true
    },
    id_materia_prima: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: InventarioMateriaPrima,
            key: 'id_materia_prima'
        },
        primaryKey: true
    },
    fecha_ingreso: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cantidad_nuevo_ingreso: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'usuario_materia_prima',
    timestamps: false
});

module.exports = UsuarioMateriaPrima;
