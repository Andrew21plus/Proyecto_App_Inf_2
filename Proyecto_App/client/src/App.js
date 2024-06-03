import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './utils/App.css'
import EtapaComponent from './pages/EtapaComponent';
import InconvenienteComponent from './pages/InconvenienteComponent';
import HomeComponent from './pages/HomeComponent';
import InventarioMPComponent from './pages/InventarioMPComponent';
import InventarioPTComponent from './pages/InventarioPTComponent';
import ProduccionComponent from './pages/ProduccionComponent';
import ProduccionEtapaComponent from './pages/ProduccionEtapaComponent';
import RolComponent from './pages/RolComponent';
import UsuarioComponent from './pages/UsuarioComponent';
import UsuarioMPComponent from './pages/UsuarioMPComponent';
import VentasComponent from './pages/VentasComponent';

function App() {

  return (
    <Router>
      <div className='App'>
        <h1>Operaciones CRUD App Gestion de Invenatario</h1>
        <Routes>
          <Route path='/' element={<HomeComponent/>}/>
          <Route path='/etapa' element={<EtapaComponent/>}/>
          <Route path='/inconveniente' element={<InconvenienteComponent/>}/>
          <Route path='/inventarioMP' element={<InventarioMPComponent/>}/>
          <Route path='/inventarioPT' element={<InventarioPTComponent/>}/>
          <Route path='/produccion' element={<ProduccionComponent/>}/>
          <Route path='/produccionEtapa' element={<ProduccionEtapaComponent/>}/>
          <Route path='/rol' element={<RolComponent/>}/>
          <Route path='/usuario' element={<UsuarioComponent/>}/>
          <Route path='/usuarioMP' element={<UsuarioMPComponent/>}/>
          <Route path='/ventas' element={<VentasComponent/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
