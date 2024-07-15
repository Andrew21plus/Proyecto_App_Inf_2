import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateInconvenienteFormData } from '../services/drawbackService';
import '../utils/StylesTotal.css';  // Asegúrate de que el archivo CSS correcto esté importado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';

const DrawBackComponent = () => {
  const [formData, setFormData] = useState({ id_produccion: '', descripcion: '' });
  const [formErrors, setFormErrors] = useState({});
  const [inconvenientes, setInconvenientes] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentInconveniente, setCurrentInconveniente] = useState(null);
  const { roles } = useAuth();

  const isGerente = roles.some(role => role.nombre_rol === 'Gerente');

  useEffect(() => {
    getInconvenientes();
    getProducciones();
  }, []);

  const getInconvenientes = () => {
    Axios.get("http://localhost:3307/inconvenientes")
      .then(response => {
        setInconvenientes(response.data);
      })
      .catch(error => {
        console.error('Error fetching inconvenientes:', error);
      });
  };

  const getProducciones = () => {
    Axios.get("http://localhost:3307/produccion")
      .then(response => {
        setProducciones(response.data);
      })
      .catch(error => {
        console.error('Error fetching producciones:', error);
      });
  };

  const addInconveniente = (e) => {
    e.preventDefault();
    const errors = validateInconvenienteFormData(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const dataToSend = {
      id_produccion: parseInt(formData.id_produccion),
      descripcion: formData.descripcion
    };

    if (editing) {
      Axios.put(`http://localhost:3307/inconvenientes/${currentInconveniente.id_inconveniente}`, dataToSend)
        .then(() => {
          alert("Inconveniente Actualizado");
          setFormData({ id_produccion: '', descripcion: '' });
          setEditing(false);
          setCurrentInconveniente(null);
          getInconvenientes();
        })
        .catch(error => {
          console.error('Error actualizando el inconveniente:', error);
        });
    } else {
      Axios.post("http://localhost:3307/inconvenientes", dataToSend)
        .then(() => {
          alert("Inconveniente Registrado");
          setFormData({ id_produccion: '', descripcion: '' });
          getInconvenientes();
        })
        .catch(error => {
          console.error('Error registrando el inconveniente:', error);
        });
    }
  };

  const deleteInconveniente = (id) => {
    Axios.delete(`http://localhost:3307/inconvenientes/${id}`)
      .then(() => {
        alert("Inconveniente Eliminado");
        getInconvenientes();
      })
      .catch(error => {
        console.error('Error eliminando el inconveniente:', error);
      });
  };

  const editInconveniente = (inconveniente) => {
    setEditing(true);
    setCurrentInconveniente(inconveniente);
    setFormData({ id_produccion: inconveniente.id_produccion.toString(), descripcion: inconveniente.descripcion });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  return (
    <div className="production-container"> {/* Cambia la clase del contenedor */}
      <h1>Inconvenientes</h1>
      {!isGerente && (
        <form onSubmit={addInconveniente} className="production-form"> {/* Cambia la clase del formulario */}
          <select name="id_produccion" value={formData.id_produccion} onChange={handleInputChange} className="input-field">
            <option value="">Selecciona una Producción</option>
            {producciones.map(produccion => (
              <option key={produccion.id_produccion} value={produccion.id_produccion}>{produccion.descripcion}</option>
            ))}
          </select>
          {formErrors.id_produccion && <span className="error">{formErrors.id_produccion}</span>}
          <br/>
          <br/>
          <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} className="input-field" />
          {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
          <br/>
          <button type="submit" className="submit-button icon-button">
            {editing ? <><FontAwesomeIcon icon={faSave} /> Actualizar Inconveniente</> : <><FontAwesomeIcon icon={faPlus} /> Agregar Inconveniente</>}
          </button>
        </form>
      )}
      <h2>Lista de Inconvenientes</h2>
      <table className="production-table"> {/* Cambia la clase de la tabla */}
        <thead>
          <tr>
            <th>ID Inconveniente</th>
            <th>ID Producción</th>
            <th>Descripción</th>
            {!isGerente && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {inconvenientes.map(inconveniente => (
            <tr key={inconveniente.id_inconveniente}>
              <td data-label="ID Inconveniente">{inconveniente.id_inconveniente}</td>
              <td data-label="ID Producción">{inconveniente.id_produccion}</td>
              <td data-label="Descripción">{inconveniente.descripcion}</td>
              {!isGerente && (
                <td data-label="Acciones">
                  <button className="edit-button icon-button" onClick={() => editInconveniente(inconveniente)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="delete-button icon-button delete-clicked" onClick={() => deleteInconveniente(inconveniente.id_inconveniente)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DrawBackComponent;
