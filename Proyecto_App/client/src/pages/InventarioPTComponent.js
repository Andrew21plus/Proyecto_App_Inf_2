import React from 'react';
import { Link } from 'react-router-dom'; 

const InventarioPTComponent = () => {
  
  return (
    <div>
      <h2>Inventario Producto Termiando Management</h2>
      <div> 
          <Link to="/"> 
            <br/>
            <button>Volver a la página principal</button>
          </Link>
        </div>
    </div>
  );
};

export default InventarioPTComponent;