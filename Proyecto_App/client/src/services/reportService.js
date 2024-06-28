import axios from 'axios';

const API_URL = 'http://localhost:3307'; // URL base de tu API

export const getReportData = async () => {
  try {
    const [produccionRes, produccionMateriaPrimaRes, inventarioProductoTerminadoRes, inconvenienteRes, inventarioMateriaPrimaRes] = await Promise.all([
      axios.get(`${API_URL}/produccion`),
      axios.get(`${API_URL}/produccion-materia-prima`),
      axios.get(`${API_URL}/inventario-producto-terminado`),
      axios.get(`${API_URL}/inconvenientes`),
      axios.get(`${API_URL}/inventario-materia-prima`)
    ]);

    const produccion = produccionRes.data;
    const produccionMateriaPrima = produccionMateriaPrimaRes.data;
    const inventarioProductoTerminado = inventarioProductoTerminadoRes.data;
    const inconvenientes = inconvenienteRes.data;
    const inventarioMateriaPrima = inventarioMateriaPrimaRes.data;

    console.log('Producción:', produccion);
    console.log('Producción Materia Prima:', produccionMateriaPrima);
    console.log('Inventario Producto Terminado:', inventarioProductoTerminado);
    console.log('Inconvenientes:', inconvenientes);
    console.log('Inventario Materia Prima:', inventarioMateriaPrima);

    // Combinar los datos obtenidos
    const reportData = produccion.map(prod => {
      const materiasPrimas = produccionMateriaPrima
        .filter(mp => mp.id_produccion === prod.id_produccion)
        .map(mp => {
          const inventarioMateriaPrimaItem = inventarioMateriaPrima.find(im => im.id_materia_prima === mp.id_materia_prima) || {};
          return {
            nombre_materia_prima: inventarioMateriaPrimaItem.nombre || '',
            proveedor: inventarioMateriaPrimaItem.proveedor || '',
            cantidad_materia_prima_disponible: inventarioMateriaPrimaItem.cantidad_disponible || 0,
            cantidad_uso: mp.cantidad_uso || 0
          };
        });

      const productoTerminado = inventarioProductoTerminado.find(pt => pt.id_produccion === prod.id_produccion) || {};
      const inconveniente = inconvenientes.find(inc => inc.id_produccion === prod.id_produccion) || {};

      return {
        fecha: prod.fecha || '',
        nombre_materia_prima: materiasPrimas.length > 0 ? materiasPrimas[0].nombre_materia_prima : '',
        proveedor: materiasPrimas.length > 0 ? materiasPrimas[0].proveedor : '',
        descripcion_produccion: prod.descripcion || '',
        cantidad_materia_prima_disponible: materiasPrimas.length > 0 ? materiasPrimas[0].cantidad_materia_prima_disponible : 0,
        cantidad_uso: materiasPrimas.length > 0 ? materiasPrimas[0].cantidad_uso : 0,
        nombre_producto_terminado: productoTerminado.nombre || '',
        cantidad_producto_terminado_disponible: productoTerminado.cantidad_disponible || 0,
        descripcion_inconveniente: inconveniente.descripcion || ''
      };
    });

    return {
      reportData,
      inventarioMateriaPrima
    };
  } catch (error) {
    console.error("Error fetching report data", error);
    throw error;
  }
};

