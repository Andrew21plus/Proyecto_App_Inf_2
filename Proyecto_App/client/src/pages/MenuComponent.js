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
import ManagementRolesComponent from './ManagementRolesComponent';
import StageComponent from './StageComponent';
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
              <li className={selectedOption === 'management-user' ? 'selected' : ''} onClick={() => setSelectedOption('management-user')}>Gestión de Usuarios</li>
              <li className={selectedOption === 'management-roles' ? 'selected' : ''} onClick={() => setSelectedOption('management-roles')}>Gestión de Roles</li>
              <li className={selectedOption === 'profile' ? 'selected' : ''} onClick={() => setSelectedOption('profile')}>Perfil</li>
              <li onClick={handleLogout}>Cerrar Sesión</li>
            </>
          )}
          {isManager && (
            <>
              <li className={selectedOption === 'inventory' ? 'selected' : ''} onClick={() => setSelectedOption('inventory')}>Inventario</li>
              <li className={selectedOption === 'drawBack' ? 'selected' : ''} onClick={() => setSelectedOption('drawBack')}>Inconvenientes</li>
              <li className={selectedOption === 'sales' ? 'selected' : ''} onClick={() => setSelectedOption('sales')}>Ventas</li>
              <li className={selectedOption === 'etapas' ? 'selected' : ''} onClick={() => setSelectedOption('etapas')}>Etapas</li>
              <li className={selectedOption === 'production' ? 'selected' : ''} onClick={() => setSelectedOption('production')}>Producción</li>
              <li className={selectedOption === 'predictions' ? 'selected' : ''} onClick={() => setSelectedOption('predictions')}>Predicciones</li>
              <li className={selectedOption === 'report' ? 'selected' : ''} onClick={() => setSelectedOption('report')}>Reporte</li>
              <li className={selectedOption === 'profile' ? 'selected' : ''} onClick={() => setSelectedOption('profile')}>Perfil</li>
              <li onClick={handleLogout}>Cerrar Sesión</li>
            </>
          )}
          {isPlantChief && (
            <>
              <li className={selectedOption === 'inventory' ? 'selected' : ''} onClick={() => setSelectedOption('inventory')}>Inventario</li>
              <li className={selectedOption === 'drawBack' ? 'selected' : ''} onClick={() => setSelectedOption('drawBack')}>Inconvenientes</li>
              <li className={selectedOption === 'production' ? 'selected' : ''} onClick={() => setSelectedOption('production')}>Producción</li>
              <li className={selectedOption === 'production-stage' ? 'selected' : ''} onClick={() => setSelectedOption('production-stage')}>Producción Etapa</li>
              <li className={selectedOption === 'profile' ? 'selected' : ''} onClick={() => setSelectedOption('profile')}>Perfil</li>
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
        {selectedOption === 'etapas' && <StageComponent />}
        {selectedOption === 'drawBack' && <DrawBackComponent />}
        {selectedOption === 'predictions' && <PredictionsComponent />}
        {selectedOption === 'report' && <ReportComponent />}
        {selectedOption === 'management-roles' && <ManagementRolesComponent />}
      </div>
    </div>
  );
};

export default MenuComponent;
