import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../utils/Styles.css'; 

const ProduccionEtapaComponent = () => {
  const [formData, setFormData] = useState({
    id_produccion: '',
    id_etapa: '',
    hora_inicio: '',
    hora_fin: '',
    estado: ''
  });
  const [produccionEtapa, setProduccionEtapa] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentProduccionEtapa, setCurrentProduccionEtapa] = useState(null);

  useEffect(() => {
    getProduccionEtapa();
    getProducciones();
    getEtapas();
  }, []);

  const getProduccionEtapa = () => {
    Axios.get("http://localhost:3307/produccion-etapa")
      .then(response => {
        setProduccionEtapa(response.data);
      })
      .catch(error => {
        console.error('Error fetching produccion_etapa:', error);
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

  const getEtapas = () => {
    Axios.get("http://localhost:3307/etapas")
      .then(response => {
        setEtapas(response.data);
      })
      .catch(error => {
        console.error('Error fetching etapas:', error);
      });
  };

  const addProduccionEtapa = (e) => {
    e.preventDefault();
    if (editing) {
      Axios.put(`http://localhost:3307/produccion-etapa/${currentProduccionEtapa.id_produccion}`, formData)
        .then(() => {
          alert("Producción Etapa Actualizada");
          setFormData({
            id_produccion: '',
            id_etapa: '',
            hora_inicio: '',
            hora_fin: '',
            estado: ''
          });
          setEditing(false);
          setCurrentProduccionEtapa(null);
          getProduccionEtapa();
        })
        .catch(error => {
          console.error('Error actualizando produccion_etapa:', error);
        });
    } else {
      Axios.post("http://localhost:3307/produccion-etapa", formData)
        .then(() => {
          alert("Producción Etapa Registrada");
          setFormData({
            id_produccion: '',
            id_etapa: '',
            hora_inicio: '',
            hora_fin: '',
            estado: ''
          });
          getProduccionEtapa();
        })
        .catch(error => {
          console.error('Error registrando produccion_etapa:', error);
        });
    }
  };

  const deleteProduccionEtapa = (id) => {
    Axios.delete(`http://localhost:3307/produccion-etapa/${id}`)
      .then(() => {
        alert("Producción Etapa Eliminada");
        getProduccionEtapa();
      })
      .catch(error => {
        console.error('Error eliminando produccion_etapa:', error);
      });
  };

  const editProduccionEtapa = (produccionEtapa) => {
    setEditing(true);
    setCurrentProduccionEtapa(produccionEtapa);
    setFormData({
      id_produccion: produccionEtapa.id_produccion,
      id_etapa: produccionEtapa.id_etapa,
      hora_inicio: produccionEtapa.hora_inicio,
      hora_fin: produccionEtapa.hora_fin,
      estado: produccionEtapa.estado
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Producción Etapa Management</h2>
      <form onSubmit={addProduccionEtapa} className="s-form">
        <select name="id_produccion" value={formData.id_produccion} onChange={handleInputChange}>
          <option value="">Selecciona una Producción</option>
          {producciones.map(produccion => (
            <option key={produccion.id_produccion} value={produccion.id_produccion}>{produccion.id_produccion}</option>
          ))}
        </select>
        <br/>
        <br/>
        <select name="id_etapa" value={formData.id_etapa} onChange={handleInputChange}>
          <option value="">Selecciona una Etapa</option>
          {etapas.map(etapa => (
            <option key={etapa.id_etapa} value={etapa.id_etapa}>{etapa.id_etapa}</option>
          ))}
        </select>
        <br/>
        <br/>
        <input type="time" name="hora_inicio" placeholder="Hora de Inicio" value={formData.hora_inicio} onChange={handleInputChange} />
        <input type="time" name="hora_fin" placeholder="Hora de Fin" value={formData.hora_fin} onChange={handleInputChange} />
        <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Producción Etapa" : "Agregar Producción Etapa"}</button> 
      </form>
      <h2>Lista de Producción Etapa</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Producción</th>
            <th>ID Etapa</th>
            <th>Hora de Inicio</th>
            <th>Hora de Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {produccionEtapa.map(pe => (
            <tr key={pe.id_produccion}>
              <td>{pe.id_produccion}</td>
              <td>{pe.id_etapa}</td>
              <td>{pe.hora_inicio}</td>
              <td>{pe.hora_fin}</td>
              <td>{pe.estado}</td>
              <td>
                <button onClick={() => editProduccionEtapa(pe)}>Editar</button>
                <button onClick={() => deleteProduccionEtapa(pe.id_produccion)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/"> 
        <br/>
        <button>Volver a la página principal</button>
      </Link>
    </div>
  );
};

export default ProduccionEtapaComponent;
