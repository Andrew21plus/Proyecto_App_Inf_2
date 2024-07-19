import React from 'react';
import '../utils/Server.css';

const ServerErrorComponent = () => {
  return (
    <div className="server-error">
      <h1>Servicio No Disponible</h1>
      <p>Lo sentimos, pero el servidor no está disponible en este momento. Por favor, intente nuevamente más tarde.</p>
    </div>
  );
};

export default ServerErrorComponent;
