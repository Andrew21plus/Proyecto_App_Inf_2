// src/pages/MenuComponent.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ManagementUserComponent from './ManagementUserComponent';
import ProfileComponent from './ProfileComponent';
import InventoryComponent from './InventoryComponent';
import ProductionComponent from './ProductionComponent';
import RegisterProductionStageComponent from './RegisterProductionComponent';
import ProductionStageComponent from './ProductionStageComponent';
import SalesComponent from './SalesComponent';
import DrawBackComponent from './DrawBackComponent';
import PredictionsComponent from './PredictionsComponent';
import ReportComponent from './ReportComponent';
import ManagementRolesComponent from './ManagementRolesComponent';
import StageComponent from './StageComponent';
import '../utils/MenuComponent.css';
import Axios from 'axios';
import { useAlert } from '../context/AlertContext';
import Modal from '../components/Modal';
import TicTacToeComponent from './TicTacToeComponent';

const MenuComponent = () => {
  const { user, roles, logout, needsPasswordReset } = useAuth();
  const { showAlert, setShowAlert } = useAlert();
  const [selectedOption, setSelectedOption] = useState('');
  const [inconvenientes, setInconvenientes] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState(0);

  const isGerente = roles.some(role => role.nombre_rol === 'Gerente');

  useEffect(() => {
    if (!user) {
      setSelectedOption('');
    } else {
      const savedOption = localStorage.getItem('selectedOption');
      if (needsPasswordReset) {
        setSelectedOption('profile');
      } else if (savedOption) {
        setSelectedOption(savedOption);
      } else {
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
      }
    }
  }, [user, roles, needsPasswordReset]);

  useEffect(() => {
    const fetchInconvenientes = () => {
      Axios.get("http://localhost:3307/inconvenientes")
        .then(response => {
          const newInconvenientes = response.data;

          if (isGerente && !firstLoad && JSON.stringify(inconvenientes) !== JSON.stringify(newInconvenientes)) {
            alert("Se ha detectado un cambio en la tabla de inconvenientes");
            setShowAlert(true);
          }
          
          setInconvenientes(newInconvenientes);
          setFirstLoad(false);
        })
        .catch(error => {
          console.error('Error fetching inconvenientes:', error);
        });
    };

    fetchInconvenientes();
    const interval = setInterval(fetchInconvenientes, 10000); // Verifica cada 10 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGerente, showAlert, setShowAlert, firstLoad]);

  const handleOptionClick = (option) => {
    if (!needsPasswordReset) {
      setSelectedOption(option);
      localStorage.setItem('selectedOption', option);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setSelectedOption('');
    localStorage.removeItem('selectedOption');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const reloadGame = () => {
    setKey(prevKey => prevKey + 1); // Cambia la clave para forzar la recarga del componente del juego
  };

  const isAdmin = roles.some(role => role.nombre_rol === 'Administrador');
  const isManager = roles.some(role => role.nombre_rol === 'Gerente');
  const isPlantChief = roles.some(role => role.nombre_rol === 'Jefe de Planta');

  return (
    <div className="menu">
      <nav className="navbar">
        <button className="menu-toggle" onClick={toggleMenu}>Menu</button>
        <ul className={`menu-items ${menuOpen ? 'active' : ''}`}>
          {isAdmin && (
            <>
              <li className={selectedOption === 'management-user' ? 'selected' : ''} onClick={() => handleOptionClick('management-user')}>Gestión de Usuarios</li>
              <li className={selectedOption === 'management-roles' ? 'selected' : ''} onClick={() => handleOptionClick('management-roles')}>Gestión de Roles</li>
              <li className={selectedOption === 'profile' ? 'selected' : ''} onClick={() => handleOptionClick('profile')}>Perfil</li>
              <li onClick={handleLogout}>Cerrar Sesión</li>
            </>
          )}
          {isManager && (
            <>
              <li className={selectedOption === 'inventory' ? 'selected' : ''} onClick={() => handleOptionClick('inventory')}>Inventario</li>
              <li className={selectedOption === 'drawBack' ? 'selected' : ''} onClick={() => handleOptionClick('drawBack')}>Inconvenientes</li>
              <li className={selectedOption === 'sales' ? 'selected' : ''} onClick={() => handleOptionClick('sales')}>Ventas</li>
              <li className={selectedOption === 'etapas' ? 'selected' : ''} onClick={() => handleOptionClick('etapas')}>Etapas</li>
              <li className={selectedOption === 'production' ? 'selected' : ''} onClick={() => handleOptionClick('production')}>Producción</li>
              <li className={selectedOption === 'production-register' ? 'selected' : ''} onClick={() => handleOptionClick('production-register')}>Registrar Producción</li>
              <li className={selectedOption === 'predictions' ? 'selected' : ''} onClick={() => handleOptionClick('predictions')}>Predicciones</li>
              <li className={selectedOption === 'report' ? 'selected' : ''} onClick={() => handleOptionClick('report')}>Reporte</li>
              <li className={selectedOption === 'profile' ? 'selected' : ''} onClick={() => handleOptionClick('profile')}>Perfil</li>
              <li onClick={handleLogout}>Cerrar Sesión</li>
            </>
          )}
          {isPlantChief && (
            <>
              <li className={selectedOption === 'inventory' ? 'selected' : ''} onClick={() => handleOptionClick('inventory')}>Inventario</li>
              <li className={selectedOption === 'drawBack' ? 'selected' : ''} onClick={() => handleOptionClick('drawBack')}>Inconvenientes</li>
              <li className={selectedOption === 'production' ? 'selected' : ''} onClick={() => handleOptionClick('production')}>Producción</li>
              <li className={selectedOption === 'production-stage' ? 'selected' : ''} onClick={() => handleOptionClick('production-stage')}>Producción Etapa</li>
              <li className={selectedOption === 'profile' ? 'selected' : ''} onClick={() => handleOptionClick('profile')}>Perfil</li>
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
        {selectedOption === 'production-register' && <RegisterProductionStageComponent />}
        {selectedOption === 'production-stage' && <ProductionStageComponent />}
        {selectedOption === 'sales' && <SalesComponent />}
        {selectedOption === 'etapas' && <StageComponent />}
        {selectedOption === 'drawBack' && <DrawBackComponent />}
        {selectedOption === 'predictions' && <PredictionsComponent />}
        {selectedOption === 'report' && <ReportComponent />}
        {selectedOption === 'management-roles' && <ManagementRolesComponent />}
      </div>
      <br/>
      <footer className="footer">
        <span className="easter-egg" onClick={toggleModal}>
          &copy; 2024 optifab. Todos los derechos reservados.
        </span>
      </footer>

      <Modal show={showModal} handleClose={toggleModal} handleReload={reloadGame}>
        <TicTacToeComponent key={key} />
      </Modal>
    </div>
  );
};

export default MenuComponent;

