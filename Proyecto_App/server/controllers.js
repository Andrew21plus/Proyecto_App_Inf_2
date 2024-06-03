const Etapa = require('./models/Etapa');
const Inconveniente = require('./models/Inconveniente');
const InventarioMateriaPrima = require('./models/InventarioMateriaPrima');
const InventarioProductoTerminado = require('./models/InventarioProductoTerminado');
const Produccion = require('./models/Produccion');
const ProduccionEtapa = require('./models/ProduccionEtapa');
const Rol = require('./models/Rol');
const Usuario = require('./models/Usuario');
const UsuarioMateriaPrima = require('./models/UsuarioMateriaPrima');
const Ventas = require('./models/Ventas');


// CRUD Etapa
exports.createEtapa = async (data) => await Etapa.create(data);
exports.getEtapas = async () => await Etapa.findAll();
exports.updateEtapa = async (id, data) => await Etapa.update(data, { where: { id_etapa: id } });
exports.deleteEtapa = async (id) => await Etapa.destroy({ where: { id_etapa: id } });

// CRUD Inconveniente
exports.createInconveniente = async (data) => await Inconveniente.create(data);
exports.getInconvenientes = async () => await Inconveniente.findAll();
exports.updateInconveniente = async (id, data) => await Inconveniente.update(data, { where: { id_inconveniente: id } });
exports.deleteInconveniente = async (id) => await Inconveniente.destroy({ where: { id_inconveniente: id } });

// CRUD InventarioMateriaPrima
exports.createInventarioMateriaPrima = async (data) => await InventarioMateriaPrima.create(data);
exports.getInventarioMateriaPrima = async () => await InventarioMateriaPrima.findAll();
exports.updateInventarioMateriaPrima = async (id, data) => await InventarioMateriaPrima.update(data, { where: { id_materia_prima: id } });
exports.deleteInventarioMateriaPrima = async (id) => await InventarioMateriaPrima.destroy({ where: { id_materia_prima: id } });

// CRUD InventarioProductoTerminado
exports.createInventarioProductoTerminado = async (data) => await InventarioProductoTerminado.create(data);
exports.getInventarioProductoTerminado = async () => await InventarioProductoTerminado.findAll();
exports.updateInventarioProductoTerminado = async (id, data) => await InventarioProductoTerminado.update(data, { where: { id_producto: id } });
exports.deleteInventarioProductoTerminado = async (id) => await InventarioProductoTerminado.destroy({ where: { id_producto: id } });

// CRUD Produccion
exports.createProduccion = async (data) => await Produccion.create(data);
exports.getProducciones = async () => await Produccion.findAll();
exports.updateProduccion = async (id, data) => await Produccion.update(data, { where: { id_produccion: id } });
exports.deleteProduccion = async (id) => await Produccion.destroy({ where: { id_produccion: id } });

// CRUD ProduccionEtapa
exports.createProduccionEtapa = async (data) => await ProduccionEtapa.create(data);
exports.getProduccionEtapas = async () => await ProduccionEtapa.findAll();
exports.updateProduccionEtapa = async (idProduccion, idEtapa, data) => await ProduccionEtapa.update(data, { where: { id_produccion: idProduccion, id_etapa: idEtapa } });
exports.deleteProduccionEtapa = async (idProduccion, idEtapa) => await ProduccionEtapa.destroy({ where: { id_produccion: idProduccion, id_etapa: idEtapa } });

// CRUD Rol
exports.createRol = async (data) => await Rol.create(data);
exports.getRoles = async () => await Rol.findAll();
exports.updateRol = async (id, data) => await Rol.update(data, { where: { id_rol: id } });
exports.deleteRol = async (id) => await Rol.destroy({ where: { id_rol: id } });

// CRUD Usuario
exports.createUsuario = async (data) => await Usuario.create(data);
exports.getUsuarios = async () => await Usuario.findAll();
exports.updateUsuario = async (id, data) => await Usuario.update(data, { where: { id_usuario: id } });
exports.deleteUsuario = async (id) => await Usuario.destroy({ where: { id_usuario: id } });

// CRUD UsuarioMateriaPrima
exports.createUsuarioMateriaPrima = async (data) => await UsuarioMateriaPrima.create(data);
exports.getUsuarioMateriaPrima = async () => await UsuarioMateriaPrima.findAll();
exports.updateUsuarioMateriaPrima = async (idUsuario, idMateriaPrima, data) => await UsuarioMateriaPrima.update(data, { where: { id_usuario: idUsuario, id_materia_prima: idMateriaPrima } });
exports.deleteUsuarioMateriaPrima = async (idUsuario, idMateriaPrima) => await UsuarioMateriaPrima.destroy({ where: { id_usuario: idUsuario, id_materia_prima: idMateriaPrima } });

// CRUD Ventas
exports.createVenta = async (data) => await Ventas.create(data);
exports.getVentas = async () => await Ventas.findAll();
exports.updateVenta = async (id, data) => await Ventas.update(data, { where: { id_venta: id } });
exports.deleteVenta = async (id) => await Ventas.destroy({ where: { id_venta: id } });