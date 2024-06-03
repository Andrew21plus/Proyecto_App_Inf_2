import React from 'react';
import { Link } from 'react-router-dom'; 

const InconvenienteComponent = () => {
  
  return (
    <div>
      <h2>Inconveniente Management</h2>
      <div> 
          <Link to="/"> 
            <br/>
            <button>Volver a la página principal</button>
          </Link>
        </div>
    </div>
  );
};

export default InconvenienteComponent;