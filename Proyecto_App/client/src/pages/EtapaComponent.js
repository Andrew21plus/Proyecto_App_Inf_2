import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import '../utils/Styles.css';

const EtapaComponent = () => {
  const [formData, setFormData] = useState({
    etapa: '',
    descripcion: ''
  });
  const [etapas, setEtapas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentEtapa, setCurrentEtapa] = useState(null);

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
  }

  const addEtapa = (e) => {
    e.preventDefault();
    if (editing) {
      Axios.put(`http://localhost:3307/etapas/${currentEtapa.id_etapa}`, formData)
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
      Axios.post("http://localhost:3307/etapas", formData)
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
  };

  return (
    <div>
      <h2>Etapa Management</h2>
      <form onSubmit={addEtapa} className="s-form">
        <input type="text" name="etapa" placeholder="Etapa" value={formData.etapa} onChange={handleInputChange} />
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Etapa" : "Agregar Etapa"}</button> 
      </form>
      <h2>Lista de Etapas</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Etapa</th>
            <th>Etapa</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {etapas.map(etapa => (
            <tr key={etapa.id_etapa}>
              <td>{etapa.id_etapa}</td>
              <td>{etapa.etapa}</td>
              <td>{etapa.descripcion}</td>
              <td>
                <button onClick={() => editEtapa(etapa)}>Editar</button>
                <button onClick={() => deleteEtapa(etapa.id_etapa)}>Eliminar</button>
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

export default EtapaComponent;
