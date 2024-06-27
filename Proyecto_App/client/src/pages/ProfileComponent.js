import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateFormData, updateUser } from '../services/profileService';
import '../utils/Styles.css'; // Importar los estilos

const ProfileComponent = () => {
  const { user, roles, setUser } = useAuth();
  const [formData, setFormData] = useState({
    cedula: '',
    nombre_usuario: '',
    apellido_usuario: '',
    email: '',
    contrasena: '',
    rol: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && roles.length > 0) {
      setFormData({
        cedula: user.cedula || '',
        nombre_usuario: user.nombre_usuario || '',
        apellido_usuario: user.apellido_usuario || '',
        email: user.email || '',
        contrasena: '', // Contraseña vacía por seguridad
        rol: roles.map(role => role.nombre_rol).join(', ')
      });
    }
  }, [user, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { error } = await updateUser(user.id_usuario, formData);
    if (error) {
      alert(error);
    } else {
      setUser({ ...user, ...formData });
      alert('Perfil actualizado exitosamente');
      setIsEditing(false); // Deshabilitar la edición después de actualizar
    }
  };

  return (
    <div className="profile-container">
      <h2>Perfil del Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Rol:
          <input type="text" name="rol" value={formData.rol} disabled />
        </label>
        <label>
          Cédula:
          <input type="text" name="cedula" value={formData.cedula} disabled />
        </label>
        <label>
          Nombre de usuario:
          <input type="text" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} disabled={!isEditing} />
          {errors.nombre_usuario && <span className="error">{errors.nombre_usuario}</span>}
        </label>
        <label>
          Apellido:
          <input type="text" name="apellido_usuario" value={formData.apellido_usuario} onChange={handleChange} disabled={!isEditing} />
          {errors.apellido_usuario && <span className="error">{errors.apellido_usuario}</span>}
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          Contraseña:
          <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} disabled={!isEditing} />
          {errors.contrasena && <span className="error">{errors.contrasena}</span>}
        </label>
        {isEditing ? (
          <>
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
          </>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
        )}
      </form>
    </div>
  );
};

export default ProfileComponent;