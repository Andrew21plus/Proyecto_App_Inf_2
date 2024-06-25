import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ManagementUserComponent from './ManagementUserComponent';
import ProfileComponent from './ProfileComponent';
import InventoryComponent from './InventoryComponent';
import ProductionComponent from './ProductionComponent';
import ProductionStageComponent from './ProductionStageComponent';
import SalesComponent from './SalesComponent';
import DrawBackComponent from './DrawBackComponent';
import PredictionsComponent from './PredictionsComponent';
import ReportComponent from './ReportComponent';
import '../utils/MenuComponent.css';

const MenuComponent = () => {
  const { user, roles, logout } = useAuth();
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (!user) {
      setSelectedOption('');
    }
  }, [user]);

  useEffect(() => {
    // Set default option based on role
    const role = roles[0]?.nombre_rol;
    switch (role) {
      case 'Administrador':
        setSelectedOption('management-user');
        break;
      case 'Gerente':
        setSelectedOption('production');
        break;
      case 'Jefe de Planta':
        setSelectedOption('production-stage');
        break;
      default:
        setSelectedOption('profile');
    }
  }, [roles]);

  const handleLogout = () => {
    logout();
    setSelectedOption('');
  };

  const isAdmin = roles.some(role => role.nombre_rol === 'Administrador');
  const isManager = roles.some(role => role.nombre_rol === 'Gerente');
  const isPlantChief = roles.some(role => role.nombre_rol === 'Jefe de Planta');

  return (
    <div className="menu">
      <nav className="navbar">
        <ul>
          {isAdmin && (
            <>
              <li onClick={() => setSelectedOption('management-user')}>Gestión de Usuarios</li>
              <li onClick={() => setSelectedOption('profile')}>Perfil</li>
              <li onClick={handleLogout}>Cerrar Sesión</li>
            </>
          )}
          {isManager && (
            <>
              <li onClick={() => setSelectedOption('inventory')}>Inventario</li>
              <li onClick={() => setSelectedOption('drawBack')}>Inconvenientes</li>
              <li onClick={() => setSelectedOption('sales')}>Ventas</li>
              <li onClick={() => setSelectedOption('production')}>Producción</li>
              <li onClick={() => setSelectedOption('predictions')}>Predicciones</li>
              <li onClick={() => setSelectedOption('report')}>Reporte</li>
              <li onClick={() => setSelectedOption('profile')}>Perfil</li>
              <li onClick={handleLogout}>Cerrar Sesión</li>
            </>
          )}
          {isPlantChief && (
            <>
              <li onClick={() => setSelectedOption('inventory')}>Inventario</li>
              <li onClick={() => setSelectedOption('drawBack')}>Inconvenientes</li>
              <li onClick={() => setSelectedOption('production')}>Producción</li>
              <li onClick={() => setSelectedOption('production-stage')}>Producción Etapa</li>
              <li onClick={() => setSelectedOption('profile')}>Perfil</li>
              <li onClick={handleLogout}>Cerrar Sesión</li>
            </>
          )}
        </ul>
      </nav>

      <div className="menu-content">
        {selectedOption === 'management-user' && <ManagementUserComponent />}
        {selectedOption === 'profile' && <ProfileComponent />}
        {selectedOption === 'inventory' && <InventoryComponent />}
        {selectedOption === 'production' && <ProductionComponent />}
        {selectedOption === 'production-stage' && <ProductionStageComponent />}
        {selectedOption === 'sales' && <SalesComponent />}
        {selectedOption === 'drawBack' && <DrawBackComponent />}
        {selectedOption === 'predictions' && <PredictionsComponent />}
        {selectedOption === 'report' && <ReportComponent />}
      </div>
    </div>
  );
};

export default MenuComponent;

