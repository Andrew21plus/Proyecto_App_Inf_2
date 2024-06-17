import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileComponent = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <p>Nombre de usuario: {user?.nombre_usuario}</p>
      {/* Aquí puedes agregar más información del perfil del usuario */}
    </div>
  );
};

export default ProfileComponent;
