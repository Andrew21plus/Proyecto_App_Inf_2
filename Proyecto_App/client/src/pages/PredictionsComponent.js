import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import { predecirNecesidad } from '../services/predictionService';

const PredictionsComponent = () => {
  const [productosTerminados, setProductosTerminados] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [materiaPrima, setMateriaPrima] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [produccionesFiltradas, setProduccionesFiltradas] = useState([]);
  const [prediccion, setPrediccion] = useState(null);

  useEffect(() => {
    obtenerProductosTerminados();
    obtenerProducciones();
    obtenerMateriaPrima();
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

  const filtrarProducciones = useCallback((productoId) => {
    const productoSeleccionado = productosTerminados.find(producto => producto.id_producto === parseInt(productoId));
    if (!productoSeleccionado) {
      setProduccionesFiltradas([]);
      return;
    }

    const filtradas = producciones.filter(produccion => produccion.id_produccion === productoSeleccionado.id_produccion);
    filtradas.forEach(produccion => {
      produccion.cantidad_producida = productoSeleccionado.cantidad_disponible;
      const materia = materiaPrima.find(mp => mp.id_materia_prima === produccion.id_materia_prima);
      if (materia) {
        produccion.materia_prima_restante = materia.cantidad_disponible - produccion.cantidad_uso;
      }
    });
    console.log('Producciones filtradas:', filtradas);
    setProduccionesFiltradas(filtradas);
  }, [producciones, productosTerminados, materiaPrima]);

  useEffect(() => {
    if (selectedProducto) {
      filtrarProducciones(selectedProducto);
    }
  }, [selectedProducto, producciones, filtrarProducciones]);

  const manejarPrediccion = async () => {
    const productoSeleccionado = productosTerminados.find(producto => producto.id_producto === parseInt(selectedProducto));
    const produccion = producciones.find(produccion => produccion.id_produccion === productoSeleccionado.id_produccion);

    const cantidadProduccion = parseFloat(productoSeleccionado.cantidad_disponible);
    const materiaPrimaUsada = parseFloat(produccion.cantidad_uso);
    const materiaPrimaRestante = parseFloat(materiaPrima.find(mp => mp.id_materia_prima === produccion.id_materia_prima).cantidad_disponible - produccion.cantidad_uso);

    console.log('Cantidad Producción:', cantidadProduccion);
    console.log('Materia Prima Usada:', materiaPrimaUsada);
    console.log('Materia Prima Restante:', materiaPrimaRestante);

    const resultado = await predecirNecesidad(cantidadProduccion, materiaPrimaUsada, materiaPrimaRestante);
    setPrediccion(resultado);
  };

  return (
    <div>
      <h1>Predicciones</h1>
      <select onChange={(e) => {
        console.log('Producto seleccionado:', e.target.value);
        setSelectedProducto(e.target.value);
      }}>
        <option value="">Selecciona un producto terminado</option>
        {productosTerminados.map(producto => (
          <option key={producto.id_producto} value={producto.id_producto}>{producto.nombre}</option>
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
              produccionesFiltradas.map(produccion => (
                <tr key={produccion.id_produccion}>
                  <td>{produccion.id_produccion}</td>
                  <td>{selectedProducto}</td>
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
    </div>
  );
};

export default PredictionsComponent;