const express = require('express');
const cors = require('cors');
const fs = require('fs');
const sequelize = require('./database');
const controllers = require('./controllers');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Sincronizar los modelos con la base de datos
sequelize.sync()
    .then(() => console.log('Models synchronized...'))
    .catch(err => console.log('Error: ' + err));

// Rutas 'Etapa'
app.post('/etapas', async (req, res) => {
    try {
        const etapa = await controllers.createEtapa(req.body);
        res.status(201).json(etapa);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/etapas', async (req, res) => {
    try {
        const etapas = await controllers.getEtapas();
        res.status(200).json(etapas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/etapas/:id', async (req, res) => {
    try {
        const updated = await controllers.updateEtapa(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/etapas/:id', async (req, res) => {
    try {
        await controllers.deleteEtapa(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'Inconveniente'
app.post('/inconvenientes', async (req, res) => {
    try {
        const inconveniente = await controllers.createInconveniente(req.body);
        res.status(201).json(inconveniente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/inconvenientes', async (req, res) => {
    try {
        const inconvenientes = await controllers.getInconvenientes();
        res.status(200).json(inconvenientes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/inconvenientes/:id', async (req, res) => {
    try {
        const updated = await controllers.updateInconveniente(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/inconvenientes/:id', async (req, res) => {
    try {
        await controllers.deleteInconveniente(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'InventarioMateriaPrima'
app.post('/inventario-materia-prima', async (req, res) => {
    try {
        const materiaPrima = await controllers.createInventarioMateriaPrima(req.body);
        res.status(201).json(materiaPrima);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/inventario-materia-prima', async (req, res) => {
    try {
        const materiasPrimas = await controllers.getInventarioMateriaPrima();
        res.status(200).json(materiasPrimas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/inventario-materia-prima/:id', async (req, res) => {
    try {
        const updated = await controllers.updateInventarioMateriaPrima(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/inventario-materia-prima/:id', async (req, res) => {
    try {
        await controllers.deleteInventarioMateriaPrima(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'InventarioProductoTerminado'
app.post('/inventario-producto-terminado', async (req, res) => {
    try {
        const productoTerminado = await controllers.createInventarioProductoTerminado(req.body);
        res.status(201).json(productoTerminado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/inventario-producto-terminado', async (req, res) => {
    try {
        const productosTerminados = await controllers.getInventarioProductoTerminado();
        res.status(200).json(productosTerminados);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/inventario-producto-terminado/:id', async (req, res) => {
    try {
        const updated = await controllers.updateInventarioProductoTerminado(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/inventario-producto-terminado/:id', async (req, res) => {
    try {
        await controllers.deleteInventarioProductoTerminado(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Nueva ruta para obtener un producto terminado por ID
app.get('/inventario-producto-terminado/:id', async (req, res) => {
    try {
        const productoTerminado = await controllers.getInventarioProductoTerminadoById(req.params.id);
        if (!productoTerminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(productoTerminado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'Produccion'
app.post('/produccion', async (req, res) => {
    try {
        const produccion = await controllers.createProduccion(req.body);
        res.status(201).json(produccion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/produccion', async (req, res) => {
    try {
        const producciones = await controllers.getProducciones();
        res.status(200).json(producciones);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/produccion/:id', async (req, res) => {
    try {
        const updated = await controllers.updateProduccion(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/produccion/:id', async (req, res) => {
    try {
        await controllers.deleteProduccion(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'ProduccionEtapa'
app.post('/produccion-etapa', async (req, res) => {
    try {
        const produccionEtapa = await controllers.createProduccionEtapa(req.body);
        res.status(201).json(produccionEtapa);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/produccion-etapa', async (req, res) => {
    try {
        const produccionEtapas = await controllers.getProduccionEtapas();
        res.status(200).json(produccionEtapas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/produccion-etapa/:id', async (req, res) => {
    try {
        const updated = await controllers.updateProduccionEtapa(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/produccion-etapa/:id', async (req, res) => {
    try {
        await controllers.deleteProduccionEtapa(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'Rol'
app.post('/roles', async (req, res) => {
    try {
        const rol = await controllers.createRol(req.body);
        res.status(201).json(rol);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/roles', async (req, res) => {
    try {
        const roles = await controllers.getRoles();
        res.status(200).json(roles);
     
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/roles/:id', async (req, res) => {
    try {
        const updated = await controllers.updateRol(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/roles/:id', async (req, res) => {
    try {
        await controllers.deleteRol(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'Usuario'
app.post('/usuarios', async (req, res) => {
    try {
        const usuario = await controllers.createUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await controllers.getUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const updated = await controllers.updateUsuario(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        await controllers.deleteUsuario(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'UsuarioMateriaPrima'
app.post('/usuario-materia-prima', async (req, res) => {
    try {
        const usuarioMateriaPrima = await controllers.createUsuarioMateriaPrima(req.body);
        res.status(201).json(usuarioMateriaPrima);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/usuario-materia-prima', async (req, res) => {
    try {
        const usuariosMateriaPrima = await controllers.getUsuarioMateriaPrima();
        res.status(200).json(usuariosMateriaPrima);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/usuario-materia-prima/:id', async (req, res) => {
    try {
        const updated = await controllers.updateUsuarioMateriaPrima(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/usuario-materia-prima/:id', async (req, res) => {
    try {
        await controllers.deleteUsuarioMateriaPrima(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas 'Ventas'
app.post('/ventas', async (req, res) => {
    try {
        const venta = await controllers.createVenta(req.body);
        res.status(201).json(venta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/ventas', async (req, res) => {
    try {
        const ventas = await controllers.getVentas();
        res.status(200).json(ventas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/ventas/:id', async (req, res) => {
    try {
        const updated = await controllers.updateVenta(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/ventas/:id', async (req, res) => {
    try {
        await controllers.deleteVenta(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3307;
app.listen(PORT, () => {
    console.log(`Corriendo en el puerto ${PORT}`);
});
