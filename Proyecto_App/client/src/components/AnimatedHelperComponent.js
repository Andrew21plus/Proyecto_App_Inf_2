// src/components/AnimatedHelperComponent.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../utils/AnimatedHelperComponent.css';

const AnimatedHelperComponent = ({ selectedOption, handleClose }) => {
  const getDescription = () => {
    switch (selectedOption) {
      case 'management-user':
        return 'Gestión de Usuarios: Aquí puedes gestionar los usuarios del sistema, crear nuevos usuarios, editar información existente y eliminar usuarios.';
      case 'profile':
        return 'Perfil: Aquí puedes ver y editar la información de tu perfil.';
      case 'inventory':
        return 'Inventario: Aquí puedes gestionar el inventario, ver el inventario actual y agregar nuevos productos.';
      case 'production':
        return 'Producción: Aquí puedes gestionar la producción, ver las producciones actuales y agregar nuevas producciones.';
      case 'production-register':
        return 'Registrar Producción: Aquí puedes registrar nuevas producciones.';
      case 'production-stage':
        return 'Producción Etapa: Aquí puedes gestionar las etapas de producción.';
      case 'sales':
        return 'Ventas: Aquí puedes gestionar las ventas, ver las ventas actuales y agregar nuevas ventas.';
      case 'etapas':
        return 'Etapas: Aquí puedes gestionar las etapas de los procesos de producción.';
      case 'drawBack':
        return 'Inconvenientes: Aquí puedes gestionar los inconvenientes reportados en el sistema.';
      case 'predictions':
        return 'Predicciones: Aquí puedes ver las predicciones de ventas y producción.';
      case 'report':
        return 'Reporte: Aquí puedes generar reportes sobre diferentes aspectos del sistema.';
      case 'management-roles':
        return 'Gestión de Roles: Aquí puedes gestionar los roles y permisos de los usuarios del sistema.';
      case 'dashboard':
        return 'Aquí puedes visualizar la cantidad de materia disponible';
      default:
        return 'Selecciona una opción del menú para obtener más información.';
    }
  };

  return (
    <div className="animated-helper-container">
      <div className="helper-character">
        <div className="bubble">
          <p>{getDescription()}</p>
          <button className="close-button" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedHelperComponent;
