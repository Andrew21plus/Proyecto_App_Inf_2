const sequelize = require('./database');
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

// Definir relaciones
Inconveniente.belongsTo(Produccion, { foreignKey: 'id_produccion' });
InventarioProductoTerminado.belongsTo(Produccion, { foreignKey: 'id_produccion' });
Produccion.belongsTo(InventarioMateriaPrima, { foreignKey: 'id_materia_prima' });
ProduccionEtapa.belongsTo(Produccion, { foreignKey: 'id_produccion' });
ProduccionEtapa.belongsTo(Etapa, { foreignKey: 'id_etapa' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });
UsuarioMateriaPrima.belongsTo(Usuario, { foreignKey: 'id_usuario' });
UsuarioMateriaPrima.belongsTo(InventarioMateriaPrima, { foreignKey: 'id_materia_prima' });
Ventas.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Ventas.belongsTo(InventarioProductoTerminado, { foreignKey: 'id_producto' });

// Sincronizar los modelos con la base de datos
sequelize.sync({ alter: true })
    .then(() => {
        console.log("Tablas sincronizadas correctamente.");
    })
    .catch((error) => {
        console.error("Error sincronizando las tablas: ", error);
    });

