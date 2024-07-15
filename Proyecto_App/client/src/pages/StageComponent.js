import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateStageFormData } from '../services/stageService';
import '../utils/StylesTotal.css';  // Asumiendo que el archivo CSS se llama StylesPC.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';

const StageComponent = () => {
  const [formData, setFormData] = useState({
    etapa: '',
    descripcion: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [etapas, setEtapas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentEtapa, setCurrentEtapa] = useState(null);
  const { roles } = useAuth();

  const isGerente = roles.some(role => role.nombre_rol === 'Gerente');
  const predefinedEtapas = ["No Inicializada", "Inicializada", "Finalizada"];

  useEffect(() => {
    getEtapas();
  }, []);

  const getEtapas = () => {
    Axios.get("http://localhost:3307/etapas")
      .then(response => {
        setEtapas(response.data);
      })
      .catch(error => {
        console.error('Error fetching etapas:', error);
      });
  };

  const addEtapa = (e) => {
    e.preventDefault();
    const errors = validateStageFormData(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const dataToSend = {
      etapa: formData.etapa,
      descripcion: formData.descripcion
    };

    if (editing) {
      Axios.put(`http://localhost:3307/etapas/${currentEtapa.id_etapa}`, dataToSend)
        .then(() => {
          alert("Etapa Actualizada");
          setFormData({
            etapa: '',
            descripcion: ''
          });
          setEditing(false);
          setCurrentEtapa(null);
          getEtapas();
        })
        .catch(error => {
          console.error('Error actualizando la etapa:', error);
        });
    } else {
      Axios.post("http://localhost:3307/etapas", dataToSend)
        .then(() => {
          alert("Etapa Registrada");
          setFormData({
            etapa: '',
            descripcion: ''
          });
          getEtapas();
        })
        .catch(error => {
          console.error('Error registrando la etapa:', error);
        });
    }
  };

  const deleteEtapa = (id) => {
    Axios.delete(`http://localhost:3307/etapas/${id}`)
      .then(() => {
        alert("Etapa Eliminada");
        getEtapas();
      })
      .catch(error => {
        console.error('Error eliminando la etapa:', error);
      });
  };

  const editEtapa = (etapa) => {
    setEditing(true);
    setCurrentEtapa(etapa);
    setFormData({
      etapa: etapa.etapa,
      descripcion: etapa.descripcion
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' }); // Clear the error when the user modifies the field
  };

  const isFormBlocked = () => {
    const etapaNames = etapas.map(etapa => etapa.etapa);
    return predefinedEtapas.every(predefined => etapaNames.includes(predefined));
  };

  const hasIncorrectEtapa = () => {
    const etapaNames = etapas.map(etapa => etapa.etapa);
    return predefinedEtapas.some(predefined => !etapaNames.includes(predefined));
  };

  return (
    <div>
      <h1>Etapas</h1>
      <h2>Gestión de Etapas</h2>
      {isGerente && !isFormBlocked() && (
        <form onSubmit={addEtapa} className="s-form">
          <input type="text" name="etapa" placeholder="Etapa" value={formData.etapa} onChange={handleInputChange} className="input-field" />
          {formErrors.etapa && <span className="error">{formErrors.etapa}</span>}
          <br/>
          <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} className="input-field" />
          {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
          <br/>
          <button type="submit" className="submit-button icon-button">
            {editing ? <><FontAwesomeIcon icon={faSave} /> Actualizar Etapa</> : <><FontAwesomeIcon icon={faPlus} /> Agregar Etapa</>}
          </button>
        </form>
      )}
      {isFormBlocked() && (
        <p>No se pueden agregar más etapas.</p>
      )}
      {hasIncorrectEtapa() && (
        <p>Las etapas deberian ser "No Inicializada", "Inicializada" y "Finalizada", caso contrario eliminar o editar.</p>
        
      )}
      <h2>Lista de Etapas</h2>
      <table className="production-table">
        <thead>
          <tr>
            {/* <th>ID Etapa</th> */}
            <th>Etapa</th>
            <th>Descripción</th>
            {isGerente && etapas.some(etapa => !predefinedEtapas.includes(etapa.etapa)) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {etapas.map(etapa => (
            <tr key={etapa.id_etapa}>
              {/* <td data-label="ID Etapa">{etapa.id_etapa}</td> */}
              <td data-label="Etapa">{etapa.etapa}</td>
              <td data-label="Descripción">{etapa.descripcion}</td>
              {isGerente && !predefinedEtapas.includes(etapa.etapa) && (
                <td data-label="Acciones">
                  <button className="edit-button icon-button" onClick={() => editEtapa(etapa)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="delete-button icon-button delete-clicked" onClick={() => deleteEtapa(etapa.id_etapa)}>
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

export default StageComponent;
