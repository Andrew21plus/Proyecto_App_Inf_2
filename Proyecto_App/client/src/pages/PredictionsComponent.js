import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import { predecirNecesidad } from '../services/predictionService';
import '../utils/StylesTotal.css';

const PredictionsComponent = () => {
  const [productosTerminados, setProductosTerminados] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [materiaPrima, setMateriaPrima] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [produccionesFiltradas, setProduccionesFiltradas] = useState([]);
  const [totalesPorSemana, setTotalesPorSemana] = useState([]);
  const [prediccion, setPrediccion] = useState(null);
  const [cantidadesDisponibles, setCantidadesDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para la carga
  const [error, setError] = useState(''); // Nuevo estado para el error

  useEffect(() => {
    obtenerProductosTerminados();
    obtenerProducciones();
    obtenerMateriaPrima();
  }, []);

  const obtenerProductosTerminados = () => {
    Axios.get("http://localhost:3307/inventario-producto-terminado")
      .then(response => {
        setProductosTerminados(response.data);
      })
      .catch(error => {
        console.error('Error fetching productos terminados:', error);
      });
  };

  const obtenerProducciones = () => {
    Axios.get("http://localhost:3307/produccion")
      .then(response => {
        setProducciones(response.data);
      })
      .catch(error => {
        console.error('Error fetching producciones:', error);
      });
  };

  const obtenerMateriaPrima = () => {
    Axios.get("http://localhost:3307/inventario-materia-prima")
      .then(response => {
        setMateriaPrima(response.data);
      })
      .catch(error => {
        console.error('Error fetching materia prima:', error);
      });
  };

  const calcularTotalesPorSemana = useCallback((producciones) => {
    const semanas = {};
    const hoy = new Date();
    const cincoSemanasAtras = new Date(hoy);
    cincoSemanasAtras.setDate(hoy.getDate() - 35); // Ajusta la fecha para incluir las últimas 5 semanas

    producciones.forEach(produccion => {
      const fecha = new Date(produccion.fecha);
      if (fecha >= cincoSemanasAtras && fecha <= hoy) { // Filtra las producciones de las últimas 5 semanas
        const año = fecha.getFullYear();
        const mes = fecha.getMonth();
        const dia = fecha.getDate();
        
        // Calcular el inicio de la semana (lunes) y el fin de la semana (domingo)
        const diaDeLaSemana = fecha.getDay();
        const inicioSemana = new Date(año, mes, dia - diaDeLaSemana + (diaDeLaSemana === 0 ? -6 : 1));
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        const claveSemana = `${inicioSemana.getFullYear()}-W${Math.ceil((((inicioSemana - new Date(inicioSemana.getFullYear(), 0, 1)) / 86400000) + inicioSemana.getDay() + 1) / 7)}`;

        if (!semanas[claveSemana]) {
          semanas[claveSemana] = {
            totalProduccion: 0,
            totalMateriaPrimaUsada: {},
            fechaInicio: inicioSemana,
            fechaFin: finSemana
          };
        }

        // Sumar cantidades producidas y usadas por cada materia prima
        semanas[claveSemana].totalProduccion += produccion.cantidad_producida;
        produccion.materiasPrimas.forEach(mp => {
          const nombreMateriaPrima = materiaPrima.find(m => m.id_materia_prima === mp.id_materia_prima)?.nombre || mp.id_materia_prima;
          if (!semanas[claveSemana].totalMateriaPrimaUsada[nombreMateriaPrima]) {
            semanas[claveSemana].totalMateriaPrimaUsada[nombreMateriaPrima] = 0;
          }
          semanas[claveSemana].totalMateriaPrimaUsada[nombreMateriaPrima] += mp.cantidad_uso;
        });
      }
    });

    const semanasOrdenadas = Object.keys(semanas)
      .map(clave => ({
        semana: clave,
        totalProduccion: semanas[clave].totalProduccion,
        totalMateriaPrimaUsada: semanas[clave].totalMateriaPrimaUsada,
        fechaInicio: semanas[clave].fechaInicio,
        fechaFin: semanas[clave].fechaFin,
      }))
      .sort((a, b) => new Date(b.fechaFin) - new Date(a.fechaFin)) // Ordenar por fecha de fin descendente
      .slice(0, 3); // Tomar las últimas 3 semanas

    return semanasOrdenadas;
  }, [materiaPrima]);

  const filtrarProducciones = useCallback((productoNombre) => {
    const productosSeleccionados = productosTerminados.filter(producto => producto.nombre === productoNombre);
    if (productosSeleccionados.length === 0) {
      setProduccionesFiltradas([]);
      setTotalesPorSemana([]);
      setCantidadesDisponibles([]);
      return;
    }

    const produccionesFiltradas = productosSeleccionados.flatMap(productoSeleccionado => {
      const filtradas = producciones.filter(produccion => produccion.id_produccion === productoSeleccionado.id_produccion);
      return filtradas.map(produccion => {
        produccion.cantidad_producida = productoSeleccionado.cantidad_disponible;
        produccion.materiasPrimas.forEach(mp => {
          const materia = materiaPrima.find(m => m.id_materia_prima === mp.id_materia_prima);
          if (materia) {
            mp.materia_prima_restante = materia.cantidad_disponible - mp.cantidad_uso;
          }
        });
        return produccion;
      });
    });

    setProduccionesFiltradas(produccionesFiltradas);

    // Calcular totales por semana
    const totales = calcularTotalesPorSemana(produccionesFiltradas);
    setTotalesPorSemana(totales);

    // Actualizar cantidades disponibles
    const materiasPrimasAsociadas = new Set(produccionesFiltradas.flatMap(produccion => produccion.materiasPrimas.map(mp => mp.id_materia_prima)));
    const cantidades = materiaPrima.filter(mp => materiasPrimasAsociadas.has(mp.id_materia_prima)).map(mp => ({
      nombre: mp.nombre,
      cantidad_disponible: mp.cantidad_disponible
    }));
    setCantidadesDisponibles(cantidades);
  }, [producciones, productosTerminados, materiaPrima, calcularTotalesPorSemana]);

  useEffect(() => {
    if (selectedProducto) {
      filtrarProducciones(selectedProducto);
      setPrediccion(null); // Reset prediction state when product changes
    }
  }, [selectedProducto, filtrarProducciones]);

  const manejarPrediccion = async () => {
    if (!selectedProducto) {
      setError('Por favor, selecciona un producto terminado antes de generar una predicción.');
      return;
    }
    setError('');
    setIsLoading(true); // Activar la carga
    const productosSeleccionados = productosTerminados.filter(producto => producto.nombre === selectedProducto);
    if (productosSeleccionados.length === 0) {
      setPrediccion(null);
      setIsLoading(false); // Desactivar la carga
      return;
    }

    const datosEntrenamiento = totalesPorSemana.map(semana => ({
      totalProduccion: semana.totalProduccion,
      totalMateriaPrimaUsada: semana.totalMateriaPrimaUsada
    }));

    try {
      const { tendencia, predicciones } = await predecirNecesidad(datosEntrenamiento, cantidadesDisponibles);
      console.log('Tendencia de producción y uso de materia prima para la siguiente semana:', tendencia);
      console.log('Predicciones finales:', predicciones);
      setPrediccion({ tendencia, predicciones });
    } catch (error) {
      console.error('Error en la predicción:', error);
      setPrediccion(null);
    } finally {
      setIsLoading(false); // Desactivar la carga
    }
  };

  const agruparProduccionesPorSemana = (producciones) => {
    const semanas = {};

    producciones.forEach(produccion => {
      const fecha = new Date(produccion.fecha);
      const año = fecha.getFullYear();
      const mes = fecha.getMonth();
      const dia = fecha.getDate();

      // Calcular el inicio de la semana (lunes) y el fin de la semana (domingo)
      const diaDeLaSemana = fecha.getDay();
      const inicioSemana = new Date(año, mes, dia - diaDeLaSemana + (diaDeLaSemana === 0 ? -6 : 1));
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);

      const claveSemana = `${inicioSemana.getFullYear()}-W${Math.ceil((((inicioSemana - new Date(inicioSemana.getFullYear(), 0, 1)) / 86400000) + inicioSemana.getDay() + 1) / 7)}`;

      if (!semanas[claveSemana]) {
        semanas[claveSemana] = [];
      }

      semanas[claveSemana].push(produccion);
    });

    return semanas;
  };

  return (
    <div className="production-container">
      <h1>Predicciones</h1>
      <div className="s-form">
        <select onChange={(e) => {
          setSelectedProducto(e.target.value);
        }}>
          <option value="">Selecciona un producto terminado</option>
          {Array.from(new Set(productosTerminados.map(producto => producto.nombre))).map(nombre => (
            <option key={nombre} value={nombre}>{nombre}</option>
          ))}
        </select>
        <button className="styled-button" onClick={manejarPrediccion}>Generar Predicción</button>
      </div>

      {error && <p className="error">{error}</p>} {/* Mostrar mensaje de error */}

      {isLoading && <div className="loader"></div>} {/* Mostrar loader */}

      {!isLoading && prediccion !== null && (
        <div>
          <h2>Predicción de Inventario</h2>
          <p>Se estima que para la próxima semana se producirá {Math.ceil(prediccion.tendencia.totalProduccion)} unidades de {selectedProducto}.</p>
          {Object.entries(prediccion.predicciones).map(([nombre, cantidad]) => (
            <p key={nombre}>
              {cantidad === 0
                ? `Para esta producción se estima que se usará ${Math.ceil(prediccion.tendencia[nombre])} unidades de ${nombre}. Con ${cantidadesDisponibles.find(c => c.nombre === nombre)?.cantidad_disponible} unidades disponibles, no es necesario comprar más ${nombre}.`
                : `Para esta producción se estima que se usará ${Math.ceil(prediccion.tendencia[nombre])} unidades de ${nombre}. Con ${cantidadesDisponibles.find(c => c.nombre === nombre)?.cantidad_disponible} unidades disponibles, para la próxima semana se necesita comprar ${Math.ceil(cantidad)} unidades de ${nombre}.`
              }
            </p>
          ))}
        </div>
      )}

      <h2>Totales de las Últimas 3 Semanas Completas</h2>
      {totalesPorSemana.length > 0 ? (
        <table className="production-table">
          <thead>
            <tr>
              <th>Semana</th>
              <th>Total Producción</th>
              <th>Total Materia Prima Usada</th>
            </tr>
          </thead>
          <tbody>
            {totalesPorSemana.map((semana, index) => (
              <tr key={index}>
                <td data-label="Semana">{semana.semana}</td>
                <td data-label="Total Producción">{semana.totalProduccion}</td>
                <td data-label="Total Materia Prima Usada">{Object.entries(semana.totalMateriaPrimaUsada).map(([nombre, cantidad]) => (
                  <div key={nombre}>{nombre}: {cantidad}</div>
                ))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay datos para mostrar.</p>
      )}

      <h2>Cantidades Disponibles de Materias Primas</h2>
      {selectedProducto && cantidadesDisponibles.length > 0 && (
        <div>
          {cantidadesDisponibles.map(({ nombre, cantidad_disponible }) => (
            <p key={nombre}>{nombre}: {cantidad_disponible}</p>
          ))}
        </div>
      )}

      <h2>Lista de Producciones</h2>
      {selectedProducto ? (
        Object.entries(agruparProduccionesPorSemana(produccionesFiltradas)).map(([semana, producciones]) => (
          <div key={semana}>
            <h3>{semana}</h3>
            <table className="production-table">
              <thead>
                <tr>
                  <th>ID Producción</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Materia Prima Usada</th>
                </tr>
              </thead>
              <tbody>
                {producciones.map((produccion, index) => (
                  <tr key={index}>
                    <td data-label="ID Producción">{produccion.id_produccion}</td>
                    <td data-label="Fecha">{produccion.fecha}</td>
                    <td data-label="Descripción">{produccion.descripcion}</td>
                    <td data-label="Materia Prima Usada">
                      {produccion.materiasPrimas.map(mp => (
                        <div key={mp.id_materia_prima}>
                          {materiaPrima.find(m => m.id_materia_prima === mp.id_materia_prima)?.nombre || mp.id_materia_prima}: {mp.cantidad_uso}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>Seleccione un producto para ver la lista de producciones.</p>
      )}
    </div>
  );
};

export default PredictionsComponent;
