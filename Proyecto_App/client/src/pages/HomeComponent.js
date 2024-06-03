import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeComponent = () =>{
    const navigate = useNavigate();
    
    return(
        <div>
            <h2>Bienvenido a la Gestion de Inventario</h2>
            <div>
                <button onClick={() => navigate('/etapa')}>Gestionar Etapa</button>
                <button onClick={() => navigate('/inconveniente')}>Gestionar Inconveniente</button>
                <button onClick={() => navigate('/inventarioMP')}>Gestionar Inventario Materia Prima</button>
                <button onClick={() => navigate('/inventarioPT')}>Gestionar Invenatario Producto Terminado</button>
                <button onClick={() => navigate('/produccion')}>Gestionar Producción</button>
                <button onClick={() => navigate('/produccionEtapa')}>Gestionar Etapa</button>
                <button onClick={() => navigate('/rol')}>Gestionar Rol</button>
                <button onClick={() => navigate('/usuario')}>Gestionar Usuario</button>
                <button onClick={() => navigate('/usuarioMP')}>Gestionar Usuario Materia Prima</button>
                <button onClick={() => navigate('/ventas')}>Gestionar Ventas</button>
            </div>
        </div>
    );
}

export default HomeComponent;
