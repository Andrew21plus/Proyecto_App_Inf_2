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
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const loadUsuarios = async () => {
    try {
      const data = await fetchUsers();
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let result;
      if (editing && currentUsuario) {
        result = await updateUser(currentUsuario.id_usuario, formData);
      } else {
        result = await createUser(formData);
      }
  
      if (result.errors) {
        setErrors(result.errors);
      } else {
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
        setErrors({});
        loadUsuarios();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  
  const handleEdit = (usuario) => {
    setFormData({
      id_rol: usuario.id_rol,
      cedula: usuario.cedula,
      nombre_usuario: usuario.nombre_usuario,
      apellido_usuario: usuario.apellido_usuario,
      email: usuario.email,
      contrasena: '',
      telefono: usuario.telefono
    });
    setEditing(true);
    setCurrentUsuario(usuario);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      loadUsuarios();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rol:</label>
          <select name="id_rol" value={formData.id_rol} onChange={handleChange}>
            <option value="">Seleccione un rol</option>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre_rol}
              </option>
            ))}
          </select>
          {errors.id_rol && <span>{errors.id_rol}</span>}
        </div>

        <div>
          <label>Cédula:</label>
          <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} />
          {errors.cedula && <span>{errors.cedula}</span>}
        </div>

        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} />
          {errors.nombre_usuario && <span>{errors.nombre_usuario}</span>}
        </div>

        <div>
          <label>Apellido:</label>
          <input type="text" name="apellido_usuario" value={formData.apellido_usuario} onChange={handleChange} />
          {errors.apellido_usuario && <span>{errors.apellido_usuario}</span>}
        </div>

        <div>
          <label>Email:</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span>{errors.email}</span>}
        </div>

        <div>
          <label>Contraseña:</label>
          <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />
          {errors.contrasena && <span>{errors.contrasena}</span>}
        </div>

        <div>
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
          {errors.telefono && <span>{errors.telefono}</span>}
        </div>

        <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
      </form>

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
          {usuariosConRoles.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.nombre_rol}</td>
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