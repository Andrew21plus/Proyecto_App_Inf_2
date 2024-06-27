import React, { useState, useEffect } from 'react';
import '../utils/Styles.css';
import { fetchRoles } from '../services/roleService';
import { createUser, updateUser, fetchUsers, deleteUser } from '../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadRoles();
    loadUsuarios();
  }, []);

  useEffect(() => {
    if (usuarios.length > 0 && roles.length > 0) {
      const usuariosConRoles = usuarios.map(usuario => {
        const rol = roles.find(rol => rol.id_rol === usuario.id_rol);
        return { ...usuario, nombre_rol: rol ? rol.nombre_rol : 'Sin rol' };
      }).filter(usuario => usuario.nombre_rol !== 'Administrador'); // Excluir Administradores
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
        setShowForm(false);
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
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    if (confirmed) {
      try {
        await deleteUser(id);
        loadUsuarios();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditing(false);
      setCurrentUsuario(null);
      setFormData({
        id_rol: '',
        cedula: '',
        nombre_usuario: '',
        apellido_usuario: '',
        email: '',
        contrasena: '',
        telefono: ''
      });
    }
  };

  return (
    <div className="management-container">
      <button onClick={toggleForm} className="icon-button add-button">
        <FontAwesomeIcon icon={showForm ? faTimes : faPlus} /> {showForm ? 'Cerrar Formulario' : 'Agregar Usuario'}
      </button>
      {showForm && (
        <div className="profile-container">
          <h2>{editing ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Rol:
              <select name="id_rol" value={formData.id_rol} onChange={handleChange}>
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre_rol}
                  </option>
                ))}
              </select>
              {errors.id_rol && <span className="error">{errors.id_rol}</span>}
            </label>

            <label>
              Cédula:
              <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} />
              {errors.cedula && <span className="error">{errors.cedula}</span>}
            </label>

            <label>
              Nombre:
              <input type="text" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} />
              {errors.nombre_usuario && <span className="error">{errors.nombre_usuario}</span>}
            </label>

            <label>
              Apellido:
              <input type="text" name="apellido_usuario" value={formData.apellido_usuario} onChange={handleChange} />
              {errors.apellido_usuario && <span className="error">{errors.apellido_usuario}</span>}
            </label>

            <label>
              Email:
              <input type="text" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>

            <label>
              Contraseña:
              <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />
              {errors.contrasena && <span className="error">{errors.contrasena}</span>}
            </label>

            <label>
              Teléfono:
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
              {errors.telefono && <span className="error">{errors.telefono}</span>}
            </label>

            <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
            {editing && (
              <button type="button" onClick={() => {
                setEditing(false);
                setCurrentUsuario(null);
                setShowForm(false);
                setFormData({
                  id_rol: '',
                  cedula: '',
                  nombre_usuario: '',
                  apellido_usuario: '',
                  email: '',
                  contrasena: '',
                  telefono: ''
                });
              }}>
                Cancelar
              </button>
            )}
          </form>
        </div>
      )}

      <h2>Lista de Usuarios</h2>
      <table className="s-table">
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
                <button
                  onClick={() => handleEdit(usuario)}
                  className="icon-button edit-button"
                  title="Editar"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(usuario.id_usuario)}
                  className="icon-button delete-button"
                  title="Eliminar"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagementUserComponent;