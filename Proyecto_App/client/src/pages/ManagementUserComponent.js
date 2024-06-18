import React, { useState, useEffect } from 'react';

import { fetchRoles } from '../services/roleService';
import { createUser, updateUser, fetchUsers, deleteUser } from '../services/userService';

const ManagementUserComponent = () => {
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
  const [usuariosConRoles, setUsuariosConRoles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadRoles();
    loadUsuarios();
  }, []);

  useEffect(() => {
    if (usuarios.length > 0 && roles.length > 0) {
      const usuariosConRoles = usuarios.map(usuario => {
        const rol = roles.find(rol => rol.id_rol === usuario.id_rol);
        return { ...usuario, nombre_rol: rol ? rol.nombre_rol : 'Sin rol' };
      });
      setUsuariosConRoles(usuariosConRoles);
    }
  }, [usuarios, roles]);

  const loadRoles = async () => {
    try {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const loadUsuarios = async () => {
    try {
      const usuariosData = await fetchUsers();
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await updateUser(currentUsuario.id_usuario, formData);
      } else {
        response = await createUser(formData);
      }

      if (response.errors) {
        setErrors(response.errors);
        return;
      }

      alert(editing ? 'Usuario Actualizado' : 'Usuario Registrado');
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
      loadUsuarios();
    } catch (error) {
      console.error('Error saving usuario:', error);
    }
  };

  const handleEdit = (usuario) => {
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

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      alert('Usuario Eliminado');
      loadUsuarios(); // Actualiza la lista de usuarios en tiempo real
    } catch (error) {
      console.error('Error deleting usuario:', error);
    }
  };

  return (
    <div>
      <h2>{editing ? "Actualizar Usuario" : "Crear Usuario"}</h2>
      <form onSubmit={handleSubmit} className="s-form">
        <select name="id_rol" value={formData.id_rol} onChange={handleInputChange}>
          <option value="">Selecciona un Rol</option>
          {roles.map(rol => (
            <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>
          ))}
        </select>
        {errors.id_rol && <p>{errors.id_rol}</p>}
        <br/>
        <br/>
        <input type="text" name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleInputChange} />
        {errors.cedula && <p>{errors.cedula}</p>}
        <input type="text" name="nombre_usuario" placeholder="Nombre" value={formData.nombre_usuario} onChange={handleInputChange} />
        {errors.nombre_usuario && <p>{errors.nombre_usuario}</p>}
        <input type="text" name="apellido_usuario" placeholder="Apellido" value={formData.apellido_usuario} onChange={handleInputChange} />
        {errors.apellido_usuario && <p>{errors.apellido_usuario}</p>}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        {errors.email && <p>{errors.email}</p>}
        <input type="password" name="contrasena" placeholder="Contraseña" value={formData.contrasena} onChange={handleInputChange} />
        {errors.contrasena && <p>{errors.contrasena}</p>}
        <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} />
        {errors.telefono && <p>{errors.telefono}</p>}
        <br/>
        <button type="submit">{editing ? "Actualizar Usuario" : "Agregar Usuario"}</button>
      </form>

      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Rol</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosConRoles.map(usuario => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.nombre_rol}</td> {/* Mostrar el nombre del rol */}
              <td>{usuario.cedula}</td>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.apellido_usuario}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono}</td>
              <td>
                <button onClick={() => handleEdit(usuario)}>Editar</button>
                <button onClick={() => handleDelete(usuario.id_usuario)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagementUserComponent;
