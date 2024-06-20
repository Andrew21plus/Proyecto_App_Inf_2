// DrawBackComponent.js
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
//import './styles.css'; 
import { validateInconvenienteFormData } from '../services/drawbackService';

const DrawBackComponent = () => {
  const [formData, setFormData] = useState({
    id_produccion: '',
    descripcion: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [inconvenientes, setInconvenientes] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentInconveniente, setCurrentInconveniente] = useState(null);

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
          setFormData({
            id_produccion: '',
            descripcion: ''
          });
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
          setFormData({
            id_produccion: '',
            descripcion: ''
          });
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
    setFormData({
      id_produccion: inconveniente.id_produccion.toString(),
      descripcion: inconveniente.descripcion
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' }); // Clear the error when the user modifies the field
  };

  return (
    <div>
      <h1>Inconvenientes</h1>
      <h2>Inconveniente Management</h2>
      <form onSubmit={addInconveniente} className="s-form">
        <select name="id_produccion" value={formData.id_produccion} onChange={handleInputChange}>
          <option value="">Selecciona una Producción</option>
          {producciones.map(produccion => (
            <option key={produccion.id_produccion} value={produccion.id_produccion}>{produccion.descripcion}</option>
          ))}
        </select>
        {formErrors.id_produccion && <span className="error">{formErrors.id_produccion}</span>}
        <br/>
        <br/>
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
        {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
        <br/>
        <button type="submit">{editing ? "Actualizar Inconveniente" : "Agregar Inconveniente"}</button> 
      </form>
      <h2>Lista de Inconvenientes</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Inconveniente</th>
            <th>ID Producción</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inconvenientes.map(inconveniente => (
            <tr key={inconveniente.id_inconveniente}>
              <td>{inconveniente.id_inconveniente}</td>
              <td>{inconveniente.id_produccion}</td>
              <td>{inconveniente.descripcion}</td>
              <td>
                <button onClick={() => editInconveniente(inconveniente)}>Editar</button>
                <button onClick={() => deleteInconveniente(inconveniente.id_inconveniente)}>Eliminar</button>
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

export default DrawBackComponent;
