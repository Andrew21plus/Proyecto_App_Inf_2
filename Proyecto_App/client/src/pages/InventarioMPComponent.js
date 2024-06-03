import React from 'react';
import { Link } from 'react-router-dom'; 

const InventarioMPComponent = () => {
  
  return (
    <div>
      <h2>Invenatario Materia Prima Management</h2>
      <div> 
          <Link to="/"> 
            <br/>
            <button>Volver a la página principal</button>
          </Link>
        </div>
    </div>
  );
};

export default InventarioMPComponent;