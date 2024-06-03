import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../utils/Styles.css'; 

const UsuarioComponent = () => {
  const [formData, setFormData] = useState({
    id_rol: '',
    cedula: '',
    nombre_usuario: '',
    apellido_usuario: '',
    email: '',
    contrasena: '',
    telefono: ''
  });
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(null);

  useEffect(() => {
    getUsuarios();
    getRoles();
  }, []);

  const getUsuarios = () => {
    Axios.get("http://localhost:3307/usuarios")
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios:', error);
      });
  };

  const getRoles = () => {
    Axios.get("http://localhost:3307/roles")
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  };

  const addUsuario = (e) => {
    e.preventDefault();
    if (editing) {
      Axios.put(`http://localhost:3307/usuarios/${currentUsuario.id_usuario}`, formData)
        .then(() => {
          alert("Usuario Actualizado");
          setFormData({
            id_rol: '',
            cedula: '',
            nombre_usuario: '',
            apellido_usuario: '',
            email: '',
            contrasena: '',
            telefono: ''
          });
          setEditing(false);
          setCurrentUsuario(null);
          getUsuarios();
        })
        .catch(error => {
          console.error('Error actualizando el usuario:', error);
        });
    } else {
      Axios.post("http://localhost:3307/usuarios", formData)
        .then(() => {
          alert("Usuario Registrado");
          setFormData({
            id_rol: '',
            cedula: '',
            nombre_usuario: '',
            apellido_usuario: '',
            email: '',
            contrasena: '',
            telefono: ''
          });
          getUsuarios();
        })
        .catch(error => {
          console.error('Error registrando el usuario:', error);
        });
    }
  };

  const deleteUsuario = (id) => {
    Axios.delete(`http://localhost:3307/usuarios/${id}`)
      .then(() => {
        alert("Usuario Eliminado");
        getUsuarios();
      })
      .catch(error => {
        console.error('Error eliminando el usuario:', error);
      });
  };

  const editUsuario = (usuario) => {
    setEditing(true);
    setCurrentUsuario(usuario);
    setFormData({
      id_rol: usuario.id_rol,
      cedula: usuario.cedula,
      nombre_usuario: usuario.nombre_usuario,
      apellido_usuario: usuario.apellido_usuario,
      email: usuario.email,
      contrasena: usuario.contrasena,
      telefono: usuario.telefono
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Usuario Management</h2>
      <form onSubmit={addUsuario} className="s-form">
        <select name="id_rol" value={formData.id_rol} onChange={handleInputChange}>
          <option value="">Selecciona un Rol</option>
          {roles.map(rol => (
            <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>
          ))}
        </select>
        <br/>
        <br/>
        <input type="text" name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleInputChange} />
        <input type="text" name="nombre_usuario" placeholder="Nombre" value={formData.nombre_usuario} onChange={handleInputChange} />
        <input type="text" name="apellido_usuario" placeholder="Apellido" value={formData.apellido_usuario} onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        <input type="password" name="contrasena" placeholder="Contraseña" value={formData.contrasena} onChange={handleInputChange} />
        <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Usuario" : "Agregar Usuario"}</button> 
      </form>
      <h2>Lista de Usuarios</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>ID Rol</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.id_rol}</td>
              <td>{usuario.cedula}</td>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.apellido_usuario}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono}</td>
              <td>
                <button onClick={() => editUsuario(usuario)}>Editar</button>
                <button onClick={() => deleteUsuario(usuario.id_usuario)}>Eliminar</button>
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

export default UsuarioComponent;
