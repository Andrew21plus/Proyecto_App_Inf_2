import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { validateProduccionFormData } from '../services/productionService.js';

const ProductionComponent = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    descripcion: '',
    materiasPrimas: [{ id_materia_prima: '', cantidad_uso: '' }] // Inicialmente un elemento vacío
  });
  const [formErrors, setFormErrors] = useState({});
  const [producciones, setProducciones] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentProduccion, setCurrentProduccion] = useState(null);

  useEffect(() => {
    getProducciones();
    getMateriasPrimas();
  }, []);

  const getProducciones = () => {
    Axios.get("http://localhost:3307/produccion")
      .then(response => {
        const producciones = response.data.map(produccion => ({
          ...produccion,
          materiasPrimas: produccion.materiasPrimas || [] // Asegurar que materiasPrimas sea un array
        }));
        setProducciones(producciones);
      })
      .catch(error => {
        console.error('Error fetching producciones:', error);
      });
  };

  const getMateriasPrimas = () => {
    Axios.get("http://localhost:3307/inventario-materia-prima")
      .then(response => {
        setMateriasPrimas(response.data);
      })
      .catch(error => {
        console.error('Error fetching materias primas:', error);
      });
  };

  const addProduccion = (e) => {
    e.preventDefault();
    console.log("Formulario enviado"); // Mensaje de depuración
    const errors = validateProduccionFormData(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const dataToSend = {
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      materiasPrimas: formData.materiasPrimas.map(mp => ({
        id_materia_prima: parseInt(mp.id_materia_prima),
        cantidad_uso: parseInt(mp.cantidad_uso)
      }))
    };

    console.log("Datos a enviar:", dataToSend); // Mensaje de depuración

    // Verificar disponibilidad de materias primas
    const verificarDisponibilidad = dataToSend.materiasPrimas.map(mp => {
      return Axios.get(`http://localhost:3307/inventario-materia-prima/${mp.id_materia_prima}`)
        .then(response => {
          const materiaPrima = response.data;
          if (materiaPrima.cantidad_disponible < mp.cantidad_uso) {
            throw new Error(`La cantidad usada no puede ser mayor que la cantidad disponible en inventario para la materia prima ${materiaPrima.descripcion}.`);
          }
          return { id_materia_prima: mp.id_materia_prima, cantidad_disponible: materiaPrima.cantidad_disponible, cantidad_uso: mp.cantidad_uso };
        });
    });

    Promise.all(verificarDisponibilidad)
      .then(disponibilidad => {
        if (editing) {
          Axios.put(`http://localhost:3307/produccion/${currentProduccion.id_produccion}`, dataToSend)
            .then(() => {
              disponibilidad.forEach(mp => {
                updateInventarioMateriaPrima(mp.id_materia_prima, mp.cantidad_disponible - mp.cantidad_uso);
              });
              alert("Producción Actualizada");
              resetForm();
              getProducciones();
            })
            .catch(error => {
              console.error('Error actualizando la producción:', error);
            });
        } else {
          Axios.post("http://localhost:3307/produccion", dataToSend)
            .then(() => {
              disponibilidad.forEach(mp => {
                updateInventarioMateriaPrima(mp.id_materia_prima, mp.cantidad_disponible - mp.cantidad_uso);
              });
              alert("Producción Registrada");
              resetForm();
              getProducciones();
            })
            .catch(error => {
              console.error('Error registrando la producción:', error);
            });
        }
      })
      .catch(error => {
        alert(error.message);
        console.error('Error verificando disponibilidad de materia prima:', error);
      });
  };

  const updateInventarioMateriaPrima = (id_materia_prima, nuevaCantidad) => {
    Axios.put(`http://localhost:3307/inventario-materia-prima/${id_materia_prima}`, { cantidad_disponible: nuevaCantidad })
      .then(() => {
        getMateriasPrimas();
      })
      .catch(error => {
        console.error('Error actualizando inventario de materia prima:', error);
      });
  };

  const resetForm = () => {
    setFormData({
      fecha: '',
      descripcion: '',
      materiasPrimas: [{ id_materia_prima: '', cantidad_uso: '' }]
    });
    setEditing(false);
    setCurrentProduccion(null);
  };

  const editProduccion = (produccion) => {
    setEditing(true);
    setCurrentProduccion(produccion);
    setFormData({
      fecha: produccion.fecha,
      descripcion: produccion.descripcion,
      materiasPrimas: produccion.materiasPrimas.map(mp => ({
        id_materia_prima: mp.id_materia_prima.toString(),
        cantidad_uso: mp.cantidad_uso.toString()
      }))
    });
  };

  const deleteProduccion = (id) => {
    Axios.delete(`http://localhost:3307/produccion/${id}`)
      .then(() => {
        alert("Producción Eliminada");
        getProducciones();
      })
      .catch(error => {
        console.error('Error eliminando la producción:', error);
      });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMateriasPrimas = formData.materiasPrimas.map((mp, i) => (
      i === index ? { ...mp, [name]: value } : mp
    ));
    setFormData({ ...formData, materiasPrimas: updatedMateriasPrimas });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleAddMateriaPrima = () => {
    setFormData({
      ...formData,
      materiasPrimas: [...formData.materiasPrimas, { id_materia_prima: '', cantidad_uso: '' }]
    });
  };

  const handleRemoveMateriaPrima = (index) => {
    const updatedMateriasPrimas = formData.materiasPrimas.filter((_, i) => i !== index);
    setFormData({ ...formData, materiasPrimas: updatedMateriasPrimas });
  };

  const getNombreMateriaPrima = (id) => {
    const materiaPrima = materiasPrimas.find(mp => mp.id_materia_prima === id);
    return materiaPrima ? materiaPrima.descripcion : 'Desconocido';
  };

  return (
    <div>
      <h1>Gestión de Producción</h1>
      <h2>Producción Management</h2>
      <form onSubmit={addProduccion} className="s-form">
        <input type="date" name="fecha" value={formData.fecha} onChange={e => setFormData({ ...formData, fecha: e.target.value })} />
        {formErrors.fecha && <span className="error">{formErrors.fecha}</span>}
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
        {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}

        {formData.materiasPrimas.map((mp, index) => (
          <div key={index}>
            <select name="id_materia_prima" value={mp.id_materia_prima} onChange={e => handleInputChange(e, index)}>
              <option value="">Selecciona una Materia Prima</option>
              {materiasPrimas.map(materiaPrima => (
                <option key={materiaPrima.id_materia_prima} value={materiaPrima.id_materia_prima}>{materiaPrima.descripcion}</option>
              ))}
            </select>
            <input type="number" name="cantidad_uso" placeholder="Cantidad de Uso" value={mp.cantidad_uso} onChange={e => handleInputChange(e, index)} />
            {formData.materiasPrimas.length > 1 && <button type="button" onClick={() => handleRemoveMateriaPrima(index)}>Eliminar</button>}
          </div>
        ))}

        <button type="button" onClick={handleAddMateriaPrima}>Agregar Materia Prima</button>
        <br/>
        <button type="submit">{editing ? "Actualizar Producción" : "Agregar Producción"}</button>
      </form>
      <h2>Lista de Producciones</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Producción</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Materias Primas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {producciones.map(produccion => (
            <tr key={produccion.id_produccion}>
              <td>{produccion.id_produccion}</td>
              <td>{produccion.fecha}</td>
              <td>{produccion.descripcion}</td>
              <td>
                {produccion.materiasPrimas.map(mp => (
                  <div key={mp.id}>
                    {getNombreMateriaPrima(mp.id_materia_prima)} - {mp.cantidad_uso}
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => editProduccion(produccion)}>Editar</button>
                <button onClick={() => deleteProduccion(produccion.id_produccion)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Link to="/">
          <br/>
          <button>Volver a la página principal</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductionComponent;
