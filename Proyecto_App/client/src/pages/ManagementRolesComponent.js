// ManagementRolesComponent.js
import React, { useState, useEffect } from 'react';
import '../utils/StylesTotal.css';  // Asumiendo que el archivo CSS se llama StylesPC.css
import { fetchRoles, createRole, updateRole, deleteRole } from '../services/roleService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const ManagementRolesComponent = () => {
  const [formData, setFormData] = useState({
    nombre_rol: '',
    descripcion: ''
  });
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentRol, setCurrentRol] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const roles = await fetchRoles();
      setRoles(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const addRol = async (e) => {
    e.preventDefault();
    if (!formData.nombre_rol || !formData.descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError('');
    try {
      if (editing) {
        await updateRole(currentRol.id_rol, formData);
        alert("Rol Actualizado");
      } else {
        await createRole(formData);
        alert("Rol Registrado");
      }
      setFormData({
        nombre_rol: '',
        descripcion: ''
      });
      setEditing(false);
      setCurrentRol(null);
      getRoles();
      setShowForm(false);
    } catch (error) {
      console.error('Error handling role:', error);
    }
  };

  const handleDeleteRol = async (id) => {
    const roleToDelete = roles.find(role => role.id_rol === id);
    if (roleToDelete.nombre_rol === 'Administrador') {
      alert("No se puede eliminar el rol Administrador.");
      return;
    }

    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este rol?');
    if (confirmed) {
      try {
        await deleteRole(id);
        alert("Rol Eliminado");
        getRoles(); // Actualizar la lista de roles
      } catch (error) {
        console.error('Error eliminando el rol:', error);
      }
    }
  };

  const editRol = (rol) => {
    setEditing(true);
    setCurrentRol(rol);
    setFormData({
      nombre_rol: rol.nombre_rol,
      descripcion: rol.descripcion
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditing(false);
      setCurrentRol(null);
      setFormData({
        nombre_rol: '',
        descripcion: ''
      });
    }
  };

  return (
    <div>
      <button onClick={toggleForm} className="icon-button add-button">
        <FontAwesomeIcon icon={showForm ? faTimes : faPlus} /> {showForm ? 'Cerrar Formulario' : 'Agregar Rol'}
      </button>
      {showForm && (
        <div className="profile-container">
          <h2>{editing ? "Editar Rol" : "Agregar Rol"}</h2>
          <form onSubmit={addRol} className="s-form">
            <label>
              Nombre del Rol:
              <input
                type="text"
                name="nombre_rol"
                placeholder="Nombre del Rol"
                value={formData.nombre_rol}
                onChange={handleInputChange}
              />
            </label>
            {error && <span className="error">{error}</span>}
            <label>
              Descripción:
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button type="submit">{editing ? "Actualizar Rol" : "Agregar Rol"}</button>
          </form>
        </div>
      )}
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
                <button
                  onClick={() => editRol(rol)}
                  className="icon-button edit-button"
                  title="Editar"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDeleteRol(rol.id_rol)}
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

export default ManagementRolesComponent;
