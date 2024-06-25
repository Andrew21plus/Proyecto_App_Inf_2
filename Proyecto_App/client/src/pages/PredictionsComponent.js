import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import { predecirNecesidad } from '../services/predictionService';

const PredictionsComponent = () => {
  const [productosTerminados, setProductosTerminados] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [materiaPrima, setMateriaPrima] = useState([]);
  const [ingresosMateriaPrima, setIngresosMateriaPrima] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [produccionesFiltradas, setProduccionesFiltradas] = useState([]);
  const [totalesPorSemana, setTotalesPorSemana] = useState([]);
  const [prediccion, setPrediccion] = useState(null);

  useEffect(() => {
    obtenerProductosTerminados();
    obtenerProducciones();
    obtenerMateriaPrima();
    obtenerIngresosMateriaPrima();
  }, []);

  const obtenerProductosTerminados = () => {
    Axios.get("http://localhost:3307/inventario-producto-terminado")
      .then(response => {
        console.log('Productos terminados:', response.data);
        setProductosTerminados(response.data);
      })
      .catch(error => {
        console.error('Error fetching productos terminados:', error);
      });
  };

  const obtenerProducciones = () => {
    Axios.get("http://localhost:3307/produccion")
      .then(response => {
        console.log('Producciones:', response.data);
        setProducciones(response.data);
      })
      .catch(error => {
        console.error('Error fetching producciones:', error);
      });
  };

  const obtenerMateriaPrima = () => {
    Axios.get("http://localhost:3307/inventario-materia-prima")
      .then(response => {
        console.log('Materia Prima:', response.data);
        setMateriaPrima(response.data);
      })
      .catch(error => {
        console.error('Error fetching materia prima:', error);
      });
  };

  const obtenerIngresosMateriaPrima = () => {
    Axios.get("http://localhost:3307/usuario-materia-prima")
      .then(response => {
        console.log('Ingresos de Materia Prima:', response.data);
        setIngresosMateriaPrima(response.data);
      })
      .catch(error => {
        console.error('Error fetching ingresos de materia prima:', error);
      });
  };

  const calcularTotalesPorSemana = useCallback((producciones) => {
    const semanas = {};
    const hoy = new Date();
    const cincoSemanasAtras = new Date(hoy);
    cincoSemanasAtras.setDate(hoy.getDate() - 35); // Ajusta la fecha para incluir las últimas 5 semanas

    producciones.forEach(produccion => {
      const fecha = new Date(produccion.fecha);
      console.log(`Producción fecha: ${fecha.toISOString().split('T')[0]}, Producto: ${produccion.id_producto}`);
      if (fecha >= cincoSemanasAtras && fecha <= hoy) { // Filtra las producciones de las últimas 5 semanas
        const año = fecha.getFullYear();
        const mes = fecha.getMonth();
        const dia = fecha.getDate();
        
        // Calcular el inicio de la semana (lunes) y el fin de la semana (viernes)
        const diaDeLaSemana = fecha.getDay();
        const inicioSemana = new Date(año, mes, dia - diaDeLaSemana + (diaDeLaSemana === 0 ? -6 : 1));
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 4);

        const claveSemana = `${inicioSemana.getFullYear()}-W${Math.ceil((((inicioSemana - new Date(inicioSemana.getFullYear(), 0, 1)) / 86400000) + inicioSemana.getDay() + 1) / 7)}`;

        if (!semanas[claveSemana]) {
          semanas[claveSemana] = {
            totalProduccion: 0,
            totalMateriaPrimaUsada: 0,
            materiaPrimaRestante: 0,
            fechaInicio: inicioSemana,
            fechaFin: finSemana,
            ultimoIngreso: 0
          };
        }
        semanas[claveSemana].totalProduccion += produccion.cantidad_producida;
        semanas[claveSemana].totalMateriaPrimaUsada += produccion.cantidad_uso;
        semanas[claveSemana].materiaPrimaRestante = produccion.materia_prima_restante; // Tomar el último valor de materia prima restante

        // Buscar el último ingreso de materia prima en la semana
        const ingresosFiltrados = ingresosMateriaPrima
          .filter(ingreso => {
            const fechaIngreso = new Date(ingreso.fecha_ingreso);
            return fechaIngreso >= semanas[claveSemana].fechaInicio && fechaIngreso <= semanas[claveSemana].fechaFin && ingreso.id_materia_prima === produccion.id_materia_prima;
          })
          .sort((a, b) => new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso));

        if (ingresosFiltrados.length > 0) {
          semanas[claveSemana].ultimoIngreso = ingresosFiltrados[0].cantidad_nuevo_ingreso;
        }

        console.log(`Semana ${claveSemana} - Último ingreso: ${semanas[claveSemana].ultimoIngreso}`);
      }
    });

    const semanasOrdenadas = Object.keys(semanas)
      .map(clave => ({
        semana: clave,
        totalProduccion: semanas[clave].totalProduccion,
        totalMateriaPrimaUsada: semanas[clave].totalMateriaPrimaUsada,
        materiaPrimaRestante: semanas[clave].materiaPrimaRestante,
        ultimoIngreso: semanas[clave].ultimoIngreso,
        fechaInicio: semanas[clave].fechaInicio,
        fechaFin: semanas[clave].fechaFin,
      }))
      .sort((a, b) => new Date(b.fechaFin) - new Date(a.fechaFin)) // Ordenar por fecha de fin descendente
      .slice(0, 5); // Tomar las últimas 5 semanas

    console.log('Totales por semana:', semanasOrdenadas);
    return semanasOrdenadas;
  }, [ingresosMateriaPrima]);

  const filtrarProducciones = useCallback((productoNombre) => {
    const productosSeleccionados = productosTerminados.filter(producto => producto.nombre === productoNombre);
    if (productosSeleccionados.length === 0) {
      setProduccionesFiltradas([]);
      return;
    }

    const produccionesFiltradas = productosSeleccionados.flatMap(productoSeleccionado => {
      const filtradas = producciones.filter(produccion => produccion.id_produccion === productoSeleccionado.id_produccion);
      return filtradas.map(produccion => {
        produccion.cantidad_producida = productoSeleccionado.cantidad_disponible;
        const materia = materiaPrima.find(mp => mp.id_materia_prima === produccion.id_materia_prima);
        if (materia) {
          produccion.materia_prima_restante = materia.cantidad_disponible - produccion.cantidad_uso;
        }
        return produccion;
      });
    });

    console.log('Producciones filtradas:', produccionesFiltradas);
    setProduccionesFiltradas(produccionesFiltradas);

    // Calcular totales por semana
    const totales = calcularTotalesPorSemana(produccionesFiltradas);
    setTotalesPorSemana(totales);
  }, [producciones, productosTerminados, materiaPrima, calcularTotalesPorSemana]);

  useEffect(() => {
    if (selectedProducto) {
      filtrarProducciones(selectedProducto);
    }
  }, [selectedProducto, filtrarProducciones]);

  const manejarPrediccion = async () => {
    const productosSeleccionados = productosTerminados.filter(producto => producto.nombre === selectedProducto);
    if (productosSeleccionados.length === 0) {
      setPrediccion(null);
      return;
    }

    // Preparar datos de entrenamiento
    const datosEntrenamiento = totalesPorSemana.map(semana => ({
      totalProduccion: semana.totalProduccion,
      totalMateriaPrimaUsada: semana.totalMateriaPrimaUsada,
      materiaPrimaRestante: semana.materiaPrimaRestante,
      ultimoIngreso: semana.ultimoIngreso
    }));

    // Verificación de datos
    console.log('Datos para la predicción:', datosEntrenamiento);

    // Asegurarse de que los datos sean arreglos antes de procesarlos
    if (!Array.isArray(datosEntrenamiento) || datosEntrenamiento.length === 0) {
      console.error('Error: Los datos para la predicción no son arreglos o están vacíos.');
      setPrediccion(null);
      return;
    }

    // Llamar a la función de predicción
    try {
      const resultado = await predecirNecesidad(datosEntrenamiento);
      setPrediccion(resultado);
    } catch (error) {
      console.error('Error en la predicción:', error);
      setPrediccion(null);
    }
  };

  return (
    <div>
      <h1>Predicciones</h1>
      <select onChange={(e) => {
        console.log('Producto seleccionado:', e.target.value);
        setSelectedProducto(e.target.value);
      }}>
        <option value="">Selecciona un producto terminado</option>
        {Array.from(new Set(productosTerminados.map(producto => producto.nombre))).map(nombre => (
          <option key={nombre} value={nombre}>{nombre}</option>
        ))}
      </select>

      <button onClick={manejarPrediccion}>Generar Predicción</button>

      {prediccion !== null && (
        <div>
          <h2>Predicción de Inventario</h2>
          <p>Se necesita comprar {prediccion.toFixed(2)} unidades de materia prima para la siguiente semana.</p>
        </div>
      )}

      <h2>Lista de Producciones</h2>
      {selectedProducto ? (
        <table>
          <thead>
            <tr>
              <th>ID Producción</th>
              <th>ID Producto</th>
              <th>Fecha</th>
              <th>Cantidad Producción</th>
              <th>Materia Prima Usada</th>
              <th>Materia Prima Restante</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {produccionesFiltradas.length > 0 ? (
              produccionesFiltradas.map((produccion, index) => (
                <tr key={index}>
                  <td>{produccion.id_produccion}</td>
                  <td>{productosTerminados.find(producto => producto.id_produccion === produccion.id_produccion).id_producto}</td>
                  <td>{produccion.fecha}</td>
                  <td>{produccion.cantidad_producida}</td>
                  <td>{produccion.cantidad_uso}</td>
                  <td>{produccion.materia_prima_restante !== undefined ? produccion.materia_prima_restante : 'N/A'}</td>
                  <td>{produccion.descripcion}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay producciones disponibles para este producto.</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p>Seleccione un producto para ver la lista de producciones.</p>
      )}

      <h2>Totales por Semana</h2>
      {totalesPorSemana.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Semana</th>
              <th>Total Producción</th>
              <th>Total Materia Prima Usada</th>
              <th>Materia Prima Restante</th>
              <th>Último Ingreso</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
            </tr>
          </thead>
          <tbody>
            {totalesPorSemana.map((semana, index) => (
              <tr key={index}>
                <td>{semana.semana}</td>
                <td>{semana.totalProduccion}</td>
                <td>{semana.totalMateriaPrimaUsada}</td>
                <td>{semana.materiaPrimaRestante}</td>
                <td>{semana.ultimoIngreso}</td>
                <td>{semana.fechaInicio.toLocaleDateString()}</td>
                <td>{semana.fechaFin.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default PredictionsComponent;
