import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateUserComponent from './CreateUserComponent';
import ProfileComponent from './ProfileComponent';
import '../utils/MenuComponent.css';

const MenuComponent = () => {
  const { user, roles, logout } = useAuth();
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (!user) {
      setSelectedOption('');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setSelectedOption('');
  };

  const isAdmin = roles.some(role => role.nombre_rol === 'Administrador');

  return (
    <div className="menu">
      <nav className="navbar">
        <ul>
          {isAdmin && (
            <>
              <li onClick={() => setSelectedOption('create-user')}>Crear Usuario</li>
            </>
          )}
          <li onClick={() => setSelectedOption('profile')}>Perfil</li>
          <li onClick={handleLogout}>Cerrar Sesión</li>
        </ul>
      </nav>

      <div className="menu-content">
        {selectedOption === 'create-user' && <CreateUserComponent />}
        {selectedOption === 'profile' && <ProfileComponent />}
      </div>
    </div>
  );
};

export default MenuComponent;


