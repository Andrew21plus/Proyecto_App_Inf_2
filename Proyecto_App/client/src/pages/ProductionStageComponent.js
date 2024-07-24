import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import '../utils/StylesTotal.css';  // Asegúrate de que el archivo CSS se llama StylesTotal.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ProductionStageComponent = () => {
  const [formData, setFormData] = useState({
    id: '',
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

  const [showModal, setShowModal] = useState(false);
  const [productoTerminado, setProductoTerminado] = useState({
    id_produccion: '',
    cantidad_disponible: '',
    nombre: ''
  });

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

  const updateProduccionEtapa = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      hora_inicio: formData.hora_inicio || null,
      hora_fin: formData.hora_fin || null,
    };
    if (dataToSend.estado === 'Finalizada') {
      setShowModal(true);
      setProductoTerminado({ id_produccion: dataToSend.id_produccion, cantidad_disponible: '', nombre: '' });
    } else {
      Axios.put(`http://localhost:3307/produccion-etapa/${currentProduccionEtapa.id}`, dataToSend)
        .then(response => {
          alert("Producción Etapa Actualizada");
          resetForm();
          getProduccionEtapa();
        })
        .catch(error => {
          console.error('Error actualizando produccion_etapa:', error);
        });
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      id_produccion: '',
      id_etapa: '',
      hora_inicio: '',
      hora_fin: '',
      estado: ''
    });
    setEditing(false);
    setCurrentProduccionEtapa(null);
  };

  const deleteProduccionEtapa = (id) => {
    Axios.delete(`http://localhost:3307/produccion-etapa/${id}`)
      .then(response => {
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
      id: produccionEtapa.id,
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

  const handleEstadoChange = (e) => {
    const { value } = e.target;
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const selectedEtapa = etapas.find(etapa => etapa.etapa === value);

    let updatedFormData = { ...formData, estado: value };

    if (value === 'Inicializada') {
      updatedFormData = { ...updatedFormData, hora_inicio: currentTime, hora_fin: '', id_etapa: selectedEtapa ? selectedEtapa.id_etapa : '' };
    } else if (value === 'Finalizada') {
      updatedFormData = { ...updatedFormData, hora_fin: currentTime, id_etapa: selectedEtapa ? selectedEtapa.id_etapa : '' };
    } else {
      updatedFormData = { ...updatedFormData, id_etapa: selectedEtapa ? selectedEtapa.id_etapa : '' };
    }

    setFormData(updatedFormData);
  };

  const handleProductoTerminadoChange = (e) => {
    const { name, value } = e.target;
    setProductoTerminado({ ...productoTerminado, [name]: value });
  };

  const addProductoTerminado = (e) => {
    e.preventDefault();
    if (!productoTerminado.cantidad_disponible || !productoTerminado.nombre) {
      alert('Todos los campos del producto terminado deben estar llenos');
      return;
    }

    Axios.post("http://localhost:3307/inventario-producto-terminado", productoTerminado)
      .then(() => {
        alert("Producto Terminado Registrado");
        setShowModal(false);
        const updatedData = {
          ...formData,
          estado: 'Finalizada',
          hora_fin: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        };

        Axios.put(`http://localhost:3307/produccion-etapa/${currentProduccionEtapa.id}`, updatedData)
          .then(response => {
            resetForm();
            getProduccionEtapa();
          })
          .catch(error => {
            console.error('Error actualizando produccion_etapa a Finalizada:', error);
          });
      })
      .catch(error => {
        console.error('Error registrando el producto terminado:', error);
      });
  };

  const fechaActual = new Date().toISOString().split('T')[0];

  const produccionEtapaFiltrada = produccionEtapa.filter(pe => {
    const produccion = producciones.find(p => p.id_produccion === pe.id_produccion);
    return produccion && produccion.fecha === fechaActual;
  });

  const getEstadoOptions = () => {
    const currentEstado = formData.estado;

    if (currentEstado === 'No Inicializada') {
      return ['Inicializada'];
    } else if (currentEstado === 'Inicializada') {
      return ['Finalizada'];
    } else {
      return ['No Inicializada', 'Inicializada', 'Finalizada'];
    }
  };

  return (
    <div className="production-container">
      <h1>Gestión de Etapa de Producción</h1>
      {editing && (
        <form onSubmit={updateProduccionEtapa} className="production-form">
          <label>Id Registro</label>
          <input type="text" name="id" value={formData.id} readOnly className="input-field" />
          <label>Id Producción</label>
          <select name="id_produccion" value={formData.id_produccion} onChange={handleInputChange} disabled className="input-field">
            <option value="">Selecciona una Producción</option>
            {producciones.map(produccion => (
              <option key={produccion.id_produccion} value={produccion.id_produccion}>{produccion.id_produccion}</option>
            ))}
          </select>
          <label>Id Etapa</label>
          <input type="text" name="id_etapa" value={formData.id_etapa} readOnly className="input-field" />
          {formData.estado === 'Inicializada' && (
            <>
              <label>Hora Inicio</label>
              <input type="time" name="hora_inicio" value={formData.hora_inicio} readOnly className="input-field" />
            </>
          )}
          {formData.estado === 'Finalizada' && (
            <>
              <label>Hora Fin</label>
              <input type="time" name="hora_fin" value={formData.hora_fin} readOnly className="input-field" />
            </>
          )}
          <label>Estado</label>
          <select name="estado" value={formData.estado} onChange={handleEstadoChange} className="input-field">
            <option value="">Selecciona un Estado</option>
            {getEstadoOptions().map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button type="submit" className="submit-button icon-button">
            Actualizar Producción Etapa
          </button>
        </form>
      )}
      <h2>Lista de Producción Etapa</h2>
      <h3>Producciones Diarias</h3>
      <table className="production-table">
        <thead>
          <tr>
            <th>ID Registro</th>
            <th>ID Producción</th>
            <th>ID Etapa</th>
            <th>Hora de Inicio</th>
            <th>Hora de Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {produccionEtapaFiltrada.map(pe => (
            <tr key={pe.id}>
              <td data-label="ID Registro">{pe.id}</td>
              <td data-label="ID Producción">{pe.id_produccion}</td>
              <td data-label="ID Etapa">{pe.id_etapa}</td>
              <td data-label="Hora de Inicio">{pe.hora_inicio}</td>
              <td data-label="Hora de Fin">{pe.hora_fin}</td>
              <td data-label="Estado">{pe.estado}</td>
              <td data-label="Acciones">
                <button className="edit-button icon-button" onClick={() => editProduccionEtapa(pe)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-button icon-button delete-clicked" onClick={() => deleteProduccionEtapa(pe.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrar Producto Terminado</h2>
            <form onSubmit={addProductoTerminado}>
              <label>ID Producción</label>
              <input type="text" name="id_produccion" value={productoTerminado.id_produccion} readOnly className="input-field" />
              <label>Cantidad Disponible</label>
              <input type="number" name="cantidad_disponible" value={productoTerminado.cantidad_disponible} onChange={handleProductoTerminadoChange} required className="input-field" />
              <label>Nombre</label>
              <input type="text" name="nombre" value={productoTerminado.nombre} onChange={handleProductoTerminadoChange} required className="input-field" />
              <button type="submit" className="submit-button icon-button">
                Registrar
              </button>
              <button type="button" className="cancel-button icon-button" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionStageComponent;
