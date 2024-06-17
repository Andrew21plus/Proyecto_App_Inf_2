import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchRoles } from '../services/roleService'; // Importa el servicio de roles
import { createUser, updateUser, fetchUsers } from '../services/userService'; // Importa el servicio de usuarios

const CreateUserComponent = () => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre_usuario: '',
    apellido_usuario: '',
    email: '',
    contrasena: '',
    telefono: '',
    id_rol: ''
  });
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadRoles();
    if (editing) {
      loadCurrentUsuario();
    }
  }, [editing]);

  const loadRoles = async () => {
    try {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const loadCurrentUsuario = async () => {
    try {
      const usuariosData = await fetchUsers();
      const usuario = usuariosData.find(u => u.id_usuario === currentUsuario.id_usuario);
      setFormData({
        cedula: usuario.cedula,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        email: usuario.email,
        contrasena: usuario.contrasena,
        telefono: usuario.telefono,
        id_rol: usuario.id_rol
      });
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
      if (editing) {
        await updateUser(currentUsuario.id_usuario, formData);
        alert('Usuario Actualizado');
      } else {
        await createUser(formData);
        alert('Usuario Registrado');
      }
      navigate('/menu');
    } catch (error) {
      console.error('Error saving usuario:', error);
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
    </div>
  );
};

export default CreateUserComponent;

