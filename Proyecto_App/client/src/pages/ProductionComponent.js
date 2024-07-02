import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { validateProduccionFormData } from '../services/productionService.js';
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
import '../utils/StylesPC.css';  // Asumiendo que el archivo CSS se llama ProductionComponent.css

const ProductionComponent = () => {
  const { roles } = useAuth(); // Obtener los roles del usuario actual
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0], // Establecer la fecha actual
    descripcion: '',
    materiasPrimas: [{ id_materia_prima: '', cantidad_uso: '' }] // Inicialmente un elemento vacío
  });
  const [formErrors, setFormErrors] = useState({});
  const [producciones, setProducciones] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentProduccion, setCurrentProduccion] = useState(null);

  const isManager = roles.some(role => role.nombre_rol === 'Gerente');
  const isPlantChief = roles.some(role => role.nombre_rol === 'Jefe de Planta');

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
      fecha: new Date().toISOString().split('T')[0], // Restablecer la fecha actual
      descripcion: '',
      materiasPrimas: [{ id_materia_prima: '', cantidad_uso: '' }]
    });
    setFormErrors({});
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

  // Obtener la fecha actual en el formato correcto
  const fechaActual = new Date().toISOString().split('T')[0];

  // Filtrar producciones según el rol del usuario
  const produccionesFiltradas = isPlantChief
    ? producciones.filter(produccion => produccion.fecha === fechaActual)
    : producciones;

  return (
    <div className="production-container">
      <h1>Gestión de Producción</h1>
      <h2>Producción Management</h2>
      <form onSubmit={addProduccion} className="production-form">
        <input type="date" name="fecha" value={formData.fecha} readOnly className="input-field" /> {/* Campo de fecha no modificable */}
        {formErrors.fecha && <span className="error">{formErrors.fecha}</span>}
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} className="input-field" />
        {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}

        {formData.materiasPrimas.map((mp, index) => (
          <div key={index} className="materia-prima">
            <select name="id_materia_prima" value={mp.id_materia_prima} onChange={e => handleInputChange(e, index)} className="input-field">
              <option value="">Seleccione una materia prima</option>
              {materiasPrimas.map(mp => (
                <option key={mp.id_materia_prima} value={mp.id_materia_prima}>{mp.descripcion}</option>
              ))}
            </select>
            {formErrors[`id_materia_prima_${index}`] && <span className="error">{formErrors[`id_materia_prima_${index}`]}</span>}
            <input type="number" name="cantidad_uso" placeholder="Cantidad de uso" value={mp.cantidad_uso} onChange={e => handleInputChange(e, index)} className="input-field" />
            {formErrors[`cantidad_uso_${index}`] && <span className="error">{formErrors[`cantidad_uso_${index}`]}</span>}
            <button type="button" className="remove-button" onClick={() => handleRemoveMateriaPrima(index)}>Eliminar</button>
          </div>
        ))}
        <button type="button" className="add-button" onClick={handleAddMateriaPrima}>Añadir Materia Prima</button>
        <button type="submit" className="submit-button">{editing ? 'Actualizar Producción' : 'Registrar Producción'}</button>
        <button type="button" className="cancel-button" onClick={resetForm}>Cancelar</button>
      </form>

      <table className="production-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Materias Primas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {produccionesFiltradas.map(produccion => (
            <tr key={produccion.id_produccion}>
              <td>{produccion.fecha}</td>
              <td>{produccion.descripcion}</td>
              <td>
                <ul>
                  {produccion.materiasPrimas.map(mp => (
                    <li key={mp.id_materia_prima}>{getNombreMateriaPrima(mp.id_materia_prima)} - {mp.cantidad_uso}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button className="edit-button" onClick={() => editProduccion(produccion)}>Editar</button>
                <button className="delete-button" onClick={() => deleteProduccion(produccion.id_produccion)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/menu" className="back-link">Volver al Menú</Link>
    </div>
  );
};

export default ProductionComponent;
