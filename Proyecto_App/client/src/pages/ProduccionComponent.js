import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../utils/Styles.css'; 

const ProduccionComponent = () => {
  const [formData, setFormData] = useState({
    id_materia_prima: '',
    fecha: '',
    cantidad_uso: '',
    descripcion: ''
  });
  const [producciones, setProducciones] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentProduccion, setCurrentProduccion] = useState(null);

  useEffect(() => {
    getProducciones();
    getMateriasPrimas();
  }, []);

  const getProducciones = () => {
    Axios.get("http://localhost:3307/produccion")
      .then(response => {
        setProducciones(response.data);
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
    const dataToSend = {
      id_materia_prima: parseInt(formData.id_materia_prima),
      fecha: formData.fecha,
      cantidad_uso: parseInt(formData.cantidad_uso),
      descripcion: formData.descripcion
    };

    if (editing) {
      Axios.put(`http://localhost:3307/produccion/${currentProduccion.id_produccion}`, dataToSend)
        .then(() => {
          alert("Producción Actualizada");
          setFormData({
            id_materia_prima: '',
            fecha: '',
            cantidad_uso: '',
            descripcion: ''
          });
          setEditing(false);
          setCurrentProduccion(null);
          getProducciones();
        })
        .catch(error => {
          console.error('Error actualizando la producción:', error);
        });
    } else {
      Axios.post("http://localhost:3307/produccion", dataToSend)
        .then(() => {
          alert("Producción Registrada");
          setFormData({
            id_materia_prima: '',
            fecha: '',
            cantidad_uso: '',
            descripcion: ''
          });
          getProducciones();
        })
        .catch(error => {
          console.error('Error registrando la producción:', error);
        });
    }
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

  const editProduccion = (produccion) => {
    setEditing(true);
    setCurrentProduccion(produccion);
    setFormData({
      id_materia_prima: produccion.id_materia_prima.toString(), // Convertir a string para el input
      fecha: produccion.fecha,
      cantidad_uso: produccion.cantidad_uso.toString(), // Convertir a string para el input
      descripcion: produccion.descripcion
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Producción Management</h2>
      <form onSubmit={addProduccion} className="s-form">
        <select name="id_materia_prima" value={formData.id_materia_prima} onChange={handleInputChange}>
          <option value="">Selecciona una Materia Prima</option>
          {materiasPrimas.map(materiaPrima => (
            <option key={materiaPrima.id_materia_prima} value={materiaPrima.id_materia_prima}>{materiaPrima.descripcion}</option>
          ))}
        </select>
        <br/>
        <br/>
        <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} />
        <input type="number" name="cantidad_uso" placeholder="Cantidad de Uso" value={formData.cantidad_uso} onChange={handleInputChange} />
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Producción" : "Agregar Producción"}</button> 
      </form>
      <h2>Lista de Producciones</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Producción</th>
            <th>ID Materia Prima</th>
            <th>Fecha</th>
            <th>Cantidad de Uso</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {producciones.map(produccion => (
            <tr key={produccion.id_produccion}>
              <td>{produccion.id_produccion}</td>
              <td>{produccion.id_materia_prima}</td>
              <td>{produccion.fecha}</td>
              <td>{produccion.cantidad_uso}</td>
              <td>{produccion.descripcion}</td>
              <td>
                <button onClick={() => editProduccion(produccion)}>Editar</button>
                <button onClick={() => deleteProduccion(produccion.id_produccion)}>Eliminar</button>
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

export default ProduccionComponent;



