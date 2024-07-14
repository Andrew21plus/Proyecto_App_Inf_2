import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { validateProduccionFormData } from '../services/productionService.js';
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
import '../utils/StylesTotal.css';  // Asumiendo que el archivo CSS se llama StylesPC.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

const ProductionComponent = () => {
  const { roles } = useAuth(); // Obtener los roles del usuario actual
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0], // Establecer la fecha actual
    descripcion: '',
    materiasPrimas: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [producciones, setProducciones] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [descripcionesUnicas, setDescripcionesUnicas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentProduccion, setCurrentProduccion] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const itemsPerPage = 15; // Número de producciones por página

  const isManager = roles.some(role => role.nombre_rol === 'Gerente');
  const isPlantChief = roles.some(role => role.nombre_rol === 'Jefe de Planta');

  useEffect(() => {
    getProducciones();
    getMateriasPrimas();
  }, []);

  useEffect(() => {
    const uniqueDescriptions = [...new Set(producciones.map(p => p.descripcion))];
    setDescripcionesUnicas(uniqueDescriptions);
  }, [producciones]);

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
      materiasPrimas: []
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

  const handleDescripcionChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, descripcion: value });

    const produccionSeleccionada = producciones.find(p => p.descripcion === value);
    if (produccionSeleccionada) {
      setFormData({
        ...formData,
        descripcion: value,
        materiasPrimas: produccionSeleccionada.materiasPrimas.map(mp => ({
          id_materia_prima: mp.id_materia_prima,
          cantidad_uso: ''
        }))
      });
    }
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
    const materiaPrima = materiasPrimas.find(mp => mp.id_materia_prima === parseInt(id));
    return materiaPrima ? materiaPrima.descripcion : 'Desconocido';
  };

  const fechaActual = new Date().toISOString().split('T')[0];

  const produccionesFiltradas = (isPlantChief
    ? producciones.filter(produccion => produccion.fecha === fechaActual)
    : producciones
  ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Cambia el orden de la ordenación aquí
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducciones = produccionesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showCancelButton = editing || formData.descripcion !== '' || formData.materiasPrimas.some(mp => mp.id_materia_prima !== '' || mp.cantidad_uso !== '');

  return (
    <div className="production-container">
      <h1>Gestión de Producción</h1>
      <h2>Registrar nueva producción</h2>
      <form onSubmit={addProduccion} className="production-form">
        <input type="date" name="fecha" value={formData.fecha} readOnly className="input-field" /> {/* Campo de fecha no modificable */}
        {formErrors.fecha && <span className="error">{formErrors.fecha}</span>}
        <select name="descripcion" value={formData.descripcion} onChange={handleDescripcionChange} className="input-field">
          <option value="">Seleccione una descripción</option>
          {descripcionesUnicas.map((descripcion, index) => (
            <option key={index} value={descripcion}>{descripcion}</option>
          ))}
        </select>
        {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}

        {formData.materiasPrimas.map((mp, index) => (
          <div key={index} className="materia-prima">
            <span>{getNombreMateriaPrima(mp.id_materia_prima)}</span>
            <input type="number" name="cantidad_uso" placeholder="Cantidad de uso" value={mp.cantidad_uso} onChange={e => handleInputChange(e, index)} className="input-field" />
            {formErrors[`cantidad_uso_${index}`] && <span className="error">{formErrors[`cantidad_uso_${index}`]}</span>}
            <button type="button" className="remove-button icon-button delete-clicked" onClick={() => handleRemoveMateriaPrima(index)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))}
        <button type="submit" className="submit-button icon-button">
          {editing ? <><FontAwesomeIcon icon={faSave} /> Actualizar Producción</> : <><FontAwesomeIcon icon={faCheck} /> Registrar Producción</>}
        </button>
        {showCancelButton && (
          <button type="button" className="cancel-button icon-button" onClick={resetForm}>
            <FontAwesomeIcon icon={faTimes} /> Cancelar
          </button>
        )}
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
          {currentProducciones.map(produccion => (
            <tr key={produccion.id_produccion}>
              <td data-label="Fecha">{produccion.fecha}</td>
              <td data-label="Descripción">{produccion.descripcion}</td>
              <td data-label="Materias Primas">
                <ul>
                  {produccion.materiasPrimas.map(mp => (
                    <li key={mp.id_materia_prima}>{getNombreMateriaPrima(mp.id_materia_prima)} - {mp.cantidad_uso}</li>
                  ))}
                </ul>
              </td>
              <td data-label="Acciones">
                <button className="edit-button icon-button" onClick={() => editProduccion(produccion)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-button icon-button delete-clicked" onClick={() => deleteProduccion(produccion.id_produccion)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(Math.ceil(produccionesFiltradas.length / itemsPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)} className={`page-link ${currentPage === number + 1 ? 'active' : ''}`}>
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductionComponent;
