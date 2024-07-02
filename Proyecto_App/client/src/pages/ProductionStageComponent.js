import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import '../utils/Styles.css';

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
        console.log('Producción Etapa fetched:', response.data);
        setProduccionEtapa(response.data);
      })
      .catch(error => {
        console.error('Error fetching produccion_etapa:', error);
      });
  };

  const getProducciones = () => {
    Axios.get("http://localhost:3307/produccion")
      .then(response => {
        console.log('Producciones fetched:', response.data);
        setProducciones(response.data);
      })
      .catch(error => {
        console.error('Error fetching producciones:', error);
      });
  };

  const getEtapas = () => {
    Axios.get("http://localhost:3307/etapas")
      .then(response => {
        console.log('Etapas fetched:', response.data);
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
      // Muestra el modal para registrar el producto terminado
      setShowModal(true);
      setProductoTerminado({ id_produccion: dataToSend.id_produccion, cantidad_disponible: '', nombre: '' });
    } else {
      // Actualiza directamente la etapa si no está finalizando
      Axios.put(`http://localhost:3307/produccion-etapa/${currentProduccionEtapa.id}`, dataToSend)
        .then(response => {
          console.log('Update response:', response.data);
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
    console.log('Form reset');
  };

  const deleteProduccionEtapa = (id) => {
    Axios.delete(`http://localhost:3307/produccion-etapa/${id}`)
      .then(response => {
        console.log('Delete response:', response.data);
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
    console.log('Editing:', produccionEtapa);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log('Input change:', name, value);
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
    console.log('Estado change:', updatedFormData);
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
            console.log('Producción Etapa actualizada con estado Finalizada:', response.data);
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

  // Obtener la fecha actual en formato YYYY-MM-DD
  const fechaActual = new Date().toISOString().split('T')[0];

  // Filtrar produccionEtapa según la fecha de las producciones
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
    <div>
      <h2>Producción Etapa Management</h2>
      {editing && (
        <form onSubmit={updateProduccionEtapa} className="s-form">
          <label>Id Registro</label>
          <input type="text" name="id" value={formData.id} readOnly />
          <br />
          <br />
          <label>Id Producción</label>
          <select name="id_produccion" value={formData.id_produccion} onChange={handleInputChange} disabled>
            <option value="">Selecciona una Producción</option>
            {producciones.map(produccion => (
              <option key={produccion.id_produccion} value={produccion.id_produccion}>{produccion.id_produccion}</option>
            ))}
          </select>
          <br />
          <br />
          <label>Id Etapa</label>
          <input type="text" name="id_etapa" value={formData.id_etapa} readOnly />
          <br />
          <br />
          {formData.estado === 'Inicializada' && (
            <>
              <label>Hora Inicio</label>
              <input type="time" name="hora_inicio" value={formData.hora_inicio} readOnly />
              <br />
              <br />
            </>
          )}
          {formData.estado === 'Finalizada' && (
            <>
              <label>Hora Fin</label>
              <input type="time" name="hora_fin" value={formData.hora_fin} readOnly />
              <br />
              <br />
            </>
          )}
          <label>Estado</label>
          <select name="estado" value={formData.estado} onChange={handleEstadoChange}>
            <option value="">Selecciona un Estado</option>
            {getEstadoOptions().map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <br />
          <br />
          <button type="submit">Actualizar Producción Etapa</button>
        </form>
      )}
      <h2>Lista de Producción Etapa</h2>
      <table className="s-table">
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
              <td>{pe.id}</td>
              <td>{pe.id_produccion}</td>
              <td>{pe.id_etapa}</td>
              <td>{pe.hora_inicio}</td>
              <td>{pe.hora_fin}</td>
              <td>{pe.estado}</td>
              <td>
                <button onClick={() => editProduccionEtapa(pe)}>Editar</button>
                <button onClick={() => deleteProduccionEtapa(pe.id)}>Eliminar</button>
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
              <input type="text" name="id_produccion" value={productoTerminado.id_produccion} readOnly />
              <br />
              <label>Cantidad Disponible</label>
              <input type="number" name="cantidad_disponible" value={productoTerminado.cantidad_disponible} onChange={handleProductoTerminadoChange} required />
              <br />
              <label>Nombre</label>
              <input type="text" name="nombre" value={productoTerminado.nombre} onChange={handleProductoTerminadoChange} required />
              <br />
              <button type="submit">Registrar</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionStageComponent;
