import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../utils/Styles.css'; 

const InventarioMPComponent = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    proveedor: '',
    cantidad_ingreso: '',
    cantidad_disponible: ''
  });
  const [inventarioMateriaPrima, setInventarioMateriaPrima] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentInventarioMP, setCurrentInventarioMP] = useState(null);

  useEffect(() => {
    getInventarioMateriaPrima();
  }, []);

  const getInventarioMateriaPrima = () => {
    Axios.get("http://localhost:3307/inventario-materia-prima")
      .then(response => {
        setInventarioMateriaPrima(response.data);
      })
      .catch(error => {
        console.error('Error fetching inventario-materia-prima:', error);
      });
  }

  const addInventarioMP = (e) => {
    e.preventDefault();
    if (editing) {
      Axios.put(`http://localhost:3307/inventario-materia-prima/${currentInventarioMP.id_materia_prima}`, formData)
        .then(() => {
          alert("Inventario Materia Prima Actualizado");
          setFormData({
            nombre: '',
            descripcion: '',
            proveedor: '',
            cantidad_ingreso: '',
            cantidad_disponible: ''
          });
          setEditing(false);
          setCurrentInventarioMP(null);
          getInventarioMateriaPrima();
        })
        .catch(error => {
          console.error('Error actualizando inventario_materia_prima:', error);
        });
    } else {
      Axios.post("http://localhost:3307/inventario-materia-prima", formData)
        .then(() => {
          alert("Inventario Materia Prima Registrado");
          setFormData({
            nombre: '',
            descripcion: '',
            proveedor: '',
            cantidad_ingreso: '',
            cantidad_disponible: ''
          });
          getInventarioMateriaPrima();
        })
        .catch(error => {
          console.error('Error registrando inventario-materia-prima:', error);
        });
    }
  };

  const deleteInventarioMP = (id) => {
    Axios.delete(`http://localhost:3307/inventario-materia-prima/${id}`)
      .then(() => {
        alert("Inventario Materia Prima Eliminado");
        getInventarioMateriaPrima();
      })
      .catch(error => {
        console.error('Error eliminando inventario-materia-prima:', error);
      });
  };

  const editInventarioMP = (inventarioMP) => {
    setEditing(true);
    setCurrentInventarioMP(inventarioMP);
    setFormData({
      nombre: inventarioMP.nombre,
      descripcion: inventarioMP.descripcion,
      proveedor: inventarioMP.proveedor,
      cantidad_ingreso: inventarioMP.cantidad_ingreso,
      cantidad_disponible: inventarioMP.cantidad_disponible
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Inventario Materia Prima Management</h2>
      <form onSubmit={addInventarioMP} className="s-form">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} />
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
        <input type="text" name="proveedor" placeholder="Proveedor" value={formData.proveedor} onChange={handleInputChange} />
        <input type="text" name="cantidad_ingreso" placeholder="Cantidad de Ingreso" value={formData.cantidad_ingreso} onChange={handleInputChange} />
        <input type="text" name="cantidad_disponible" placeholder="Cantidad Disponible" value={formData.cantidad_disponible} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Inventario Materia Prima" : "Agregar Inventario Materia Prima"}</button> 
      </form>
      <h2>Lista de Inventario Materia Prima</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Proveedor</th>
            <th>Cantidad de Ingreso</th>
            <th>Cantidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventarioMateriaPrima.map(inventarioMP => (
            <tr key={inventarioMP.id_materia_prima}>
              <td>{inventarioMP.id_materia_prima}</td>
              <td>{inventarioMP.nombre}</td>
              <td>{inventarioMP.descripcion}</td>
              <td>{inventarioMP.proveedor}</td>
              <td>{inventarioMP.cantidad_ingreso}</td>
              <td>{inventarioMP.cantidad_disponible}</td>
              <td>
                <button onClick={() => editInventarioMP(inventarioMP)}>Editar</button>
                <button onClick={() => deleteInventarioMP(inventarioMP.id_materia_prima)}>Eliminar</button>
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

export default InventarioMPComponent;

