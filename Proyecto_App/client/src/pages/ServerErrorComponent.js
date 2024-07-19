import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import '../utils/Server.css';

const ServerErrorComponent = () => {
  return (
    <div className="server-error">
      <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
      <h1>Servicio No Disponible</h1>
      <p>Lo sentimos, pero el servidor no está disponible en este momento. Por favor, intente nuevamente más tarde.</p>
    </div>
  );
};

export default ServerErrorComponent;
