import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../utils/Styles.css'; 

const RolComponent = () => {
  const [formData, setFormData] = useState({
    nombre_rol: '',
    descripcion: ''
  });
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentRol, setCurrentRol] = useState(null);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = () => {
    Axios.get("http://localhost:3307/roles")
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }

  const addRol = (e) => {
    e.preventDefault();
    if (editing) {
      Axios.put(`http://localhost:3307/roles/${currentRol.id_rol}`, formData)
        .then(() => {
          alert("Rol Actualizado");
          setFormData({
            nombre_rol: '',
            descripcion: ''
          });
          setEditing(false);
          setCurrentRol(null);
          getRoles();
        })
        .catch(error => {
          console.error('Error actualizando el rol:', error);
        });
    } else {
      Axios.post("http://localhost:3307/roles", formData)
        .then(() => {
          alert("Rol Registrado");
          setFormData({
            nombre_rol: '',
            descripcion: ''
          });
          getRoles();
        })
        .catch(error => {
          console.error('Error registrando el rol:', error);
        });
    }
  };

  const deleteRol = (id) => {
    Axios.delete(`http://localhost:3307/roles/${id}`)
      .then(() => {
        alert("Rol Eliminado");
        getRoles();
      })
      .catch(error => {
        console.error('Error eliminando el rol:', error);
      });
  };

  const editRol = (rol) => {
    setEditing(true);
    setCurrentRol(rol);
    setFormData({
      nombre_rol: rol.nombre_rol,
      descripcion: rol.descripcion
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Rol Management</h2>
      <form onSubmit={addRol} className="s-form">
        <input type="text" name="nombre_rol" placeholder="Nombre del Rol" value={formData.nombre_rol} onChange={handleInputChange} />
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Rol" : "Agregar Rol"}</button> 
      </form>
      <h2>Lista de Roles</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Rol</th>
            <th>Nombre del Rol</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(rol => (
            <tr key={rol.id_rol}>
              <td>{rol.id_rol}</td>
              <td>{rol.nombre_rol}</td>
              <td>{rol.descripcion}</td>
              <td>
                <button onClick={() => editRol(rol)}>Editar</button>
                <button onClick={() => deleteRol(rol.id_rol)}>Eliminar</button>
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

export default RolComponent;
