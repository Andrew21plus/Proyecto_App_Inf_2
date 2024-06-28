import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateStageFormData } from '../services/stageService';

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

  return (
    <div>
      <h1>Etapas</h1>
      <h2>Gestión de Etapas</h2>
      {isGerente && (
        <form onSubmit={addEtapa} className="s-form">
          <input type="text" name="etapa" placeholder="Etapa" value={formData.etapa} onChange={handleInputChange} />
          {formErrors.etapa && <span className="error">{formErrors.etapa}</span>}
          <br/>
          <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
          {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
          <br/>
          <button type="submit">{editing ? "Actualizar Etapa" : "Agregar Etapa"}</button>
        </form>
      )}
      <h2>Lista de Etapas</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Etapa</th>
            <th>Etapa</th>
            <th>Descripción</th>
            {isGerente && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {etapas.map(etapa => (
            <tr key={etapa.id_etapa}>
              <td>{etapa.id_etapa}</td>
              <td>{etapa.etapa}</td>
              <td>{etapa.descripcion}</td>
              {isGerente && (
                <td>
                  <button onClick={() => editEtapa(etapa)}>Editar</button>
                  <button onClick={() => deleteEtapa(etapa.id_etapa)}>Eliminar</button>
                </td>
              )}
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

export default StageComponent;
