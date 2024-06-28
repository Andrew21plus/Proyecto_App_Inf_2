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
const ProduccionMateriaPrima = require('./models/ProduccionMateriaPrima');
const bcrypt = require('bcrypt');

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
// Obtener un producto terminado por ID
exports.getInventarioProductoTerminadoById = async (id) => {
    return await InventarioProductoTerminado.findByPk(id);
};

// CRUD Produccion

exports.createProduccion = async (data) => {
    const { materiasPrimas, ...produccionData } = data;
    console.log('Datos recibidos para la producción:', data); // Registro de depuración
    try {
        const produccion = await Produccion.create(produccionData);
        console.log('Producción creada:', produccion);
        
        if (materiasPrimas && materiasPrimas.length > 0) {
            const materiaPrimaData = materiasPrimas.map(mp => ({
                id_produccion: produccion.id_produccion,
                id_materia_prima: mp.id_materia_prima,
                cantidad_uso: mp.cantidad_uso
            }));
            console.log('Datos de materias primas a insertar:', materiaPrimaData); // Registro de depuración

            // Intentar insertar las materias primas y capturar cualquier error
            try {
                await ProduccionMateriaPrima.bulkCreate(materiaPrimaData);
                console.log('Materias primas insertadas correctamente');
            } catch (bulkCreateError) {
                console.error('Error al insertar materias primas:', bulkCreateError);
            }
        } else {
            console.log('No se recibieron materias primas para insertar');
        }
        
        return produccion;
    } catch (error) {
        console.error('Error al crear la producción:', error);
    }
};


exports.getProducciones = async () => {
    const producciones = await Produccion.findAll({
        include: [{
            model: ProduccionMateriaPrima,
            as: 'materiasPrimas'
        }]
    });
    return producciones;
};


exports.updateProduccion = async (id, data) => {
    const { materiasPrimas, ...produccionData } = data;
    const produccion = await Produccion.update(produccionData, { where: { id_produccion: id } });
    if (materiasPrimas && materiasPrimas.length > 0) {
        await ProduccionMateriaPrima.destroy({ where: { id_produccion: id } });
        await ProduccionMateriaPrima.bulkCreate(materiasPrimas.map(mp => ({
            id_produccion: id,
            id_materia_prima: mp.id_materia_prima,
            cantidad_uso: mp.cantidad_uso
        })));
    }
    return produccion;
};

exports.deleteProduccion = async (id) => {
    await ProduccionMateriaPrima.destroy({ where: { id_produccion: id } }); // Asegúrate de eliminar las materias primas asociadas
    await Produccion.destroy({ where: { id_produccion: id } });
};

// CRUD ProduccionEtapa
exports.createProduccionEtapa = async (data) => await ProduccionEtapa.create(data);
exports.getProduccionEtapas = async () => await ProduccionEtapa.findAll();
exports.updateProduccionEtapa = async (id, data) => await ProduccionEtapa.update(data, { where: { id } });
exports.deleteProduccionEtapa = async (id) => await ProduccionEtapa.destroy({ where: { id } });

// CRUD ProduccionMateriaPrima
exports.createProduccionMateriaPrima = async (data) => await ProduccionMateriaPrima.create(data);
exports.getProduccionMateriaPrima = async () => await ProduccionMateriaPrima.findAll();
exports.updateProduccionMateriaPrima = async (id, data) => await ProduccionMateriaPrima.update(data, { where: { id } });
exports.deleteProduccionMateriaPrima = async (id) => await ProduccionMateriaPrima.destroy({ where: { id } });

// CRUD Rol
exports.createRol = async (data) => await Rol.create(data);
exports.getRoles = async () => await Rol.findAll();
exports.updateRol = async (id, data) => await Rol.update(data, { where: { id_rol: id } });
exports.deleteRol = async (id) => await Rol.destroy({ where: { id_rol: id } });

// CRUD Usuario
exports.createUsuario = async (data) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.contrasena, saltRounds);
    data.contrasena = hashedPassword;
    return await Usuario.create(data);
  };
exports.getUsuarios = async () => await Usuario.findAll();
exports.updateUsuario = async (id, data) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    if (usuario.id_rol !== 1 && data.contrasena) {
        const saltRounds = 10;
        data.contrasena = await bcrypt.hash(data.contrasena, saltRounds);
    }
    
    return await Usuario.update(data, { where: { id_usuario: id } });
};

exports.deleteUsuario = async (id) => await Usuario.destroy({ where: { id_usuario: id } });

const generateTempPassword = () => {
    // Generar una contraseña temporal
    return Math.random().toString(36).slice(-8);
};

exports.resetPassword = async (email) => {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    await Usuario.update({ contrasena: hashedPassword }, { where: { email } });
    return tempPassword;
};

// Función para autenticar un usuario
exports.authenticateUser = async (email, password) => {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        return null; // Usuario no encontrado
    }

    if (usuario.id_rol === 1) {
        // Si el usuario es administrador, no desencriptar la contraseña
        if (password === usuario.contrasena) {
            return {
                id_usuario: usuario.id_usuario,
                email: usuario.email,
                id_rol: usuario.id_rol,
                cedula: usuario.cedula,
                nombre_usuario: usuario.nombre_usuario,
                apellido_usuario: usuario.apellido_usuario,
                telefono: usuario.telefono,
                // Otros datos relevantes del usuario si los necesitas
            };
        } else {
            return null; // Contraseña inválida
        }
    } else {
        // Si el usuario no es administrador, desencriptar la contraseña
        const match = await bcrypt.compare(password, usuario.contrasena);
        if (match) {
            return {
                id_usuario: usuario.id_usuario,
                email: usuario.email,
                id_rol: usuario.id_rol,
                cedula: usuario.cedula,
                nombre_usuario: usuario.nombre_usuario,
                apellido_usuario: usuario.apellido_usuario,
                telefono: usuario.telefono,
                // Otros datos relevantes del usuario si los necesitas
            };
        } else {
            return null; // Contraseña inválida
        }
    }
};
// CRUD UsuarioMateriaPrima
exports.createUsuarioMateriaPrima = async (data) => await UsuarioMateriaPrima.create(data);
exports.getUsuarioMateriaPrima = async () => await UsuarioMateriaPrima.findAll();
exports.updateUsuarioMateriaPrima = async (id, data) => await UsuarioMateriaPrima.update(data, { where: { id: id } });
exports.deleteUsuarioMateriaPrima = async (id) => await UsuarioMateriaPrima.destroy({ where: { id: id } });

// CRUD Ventas
exports.createVenta = async (data) => await Ventas.create(data);
exports.getVentas = async () => await Ventas.findAll();
exports.updateVenta = async (id, data) => await Ventas.update(data, { where: { id_venta: id } });
exports.deleteVenta = async (id) => await Ventas.destroy({ where: { id_venta: id } });
