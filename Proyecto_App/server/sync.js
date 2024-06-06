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
Inconveniente.belongsTo(Produccion, { foreignKey: 'ID_PRODUCCION' });
InventarioProductoTerminado.belongsTo(Produccion, { foreignKey: 'ID_PRODUCCION' });
Produccion.belongsTo(InventarioMateriaPrima, { foreignKey: 'ID_MATERIA_PRIMA' });
ProduccionEtapa.belongsTo(Produccion, { foreignKey: 'ID_PRODUCCION' });
ProduccionEtapa.belongsTo(Etapa, { foreignKey: 'ID_ETAPA' });
Usuario.belongsTo(Rol, { foreignKey: 'ID_ROL' });
UsuarioMateriaPrima.belongsTo(Usuario, { foreignKey: 'ID_USUARIO' });
UsuarioMateriaPrima.belongsTo(InventarioMateriaPrima, { foreignKey: 'ID_MATERIA_PRIMA' });
Ventas.belongsTo(Usuario, { foreignKey: 'ID_USUARIO' });
Ventas.belongsTo(InventarioProductoTerminado, { foreignKey: 'ID_PRODUCTO' });

// Sincronizar los modelos con la base de datos
sequelize.sync({ force: true })
    .then(() => {
        console.log("Tablas sincronizadas correctamente.");
    })
    .catch((error) => {
        console.error("Error sincronizando las tablas: ", error);
    });
