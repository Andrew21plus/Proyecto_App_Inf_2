import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useServerStatus from './hooks/useServerStatus';
import './utils/App.css';
import LoginComponent from './pages/LoginComponent';
import MenuComponent from './pages/MenuComponent';
import ManagementUserComponent from './pages/ManagementUserComponent';
import ProfileComponent from './pages/ProfileComponent';
import InventoryComponent from './pages/InventoryComponent';
import ProductionComponent from './pages/ProductionComponent';
import RegisterProductionComponent from './pages/RegisterProductionComponent';
import ProductionStageComponent from './pages/ProductionStageComponent';
import SalesComponent from './pages/SalesComponent';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DrawBackComponent from './pages/DrawBackComponent';
import PredictionsComponent from './pages/PredictionsComponent';
import PasswordResetComponent from './pages/PasswordResetComponent';
import ManagementRolesComponent from './pages/ManagementRolesComponent';
import ReportComponent from './pages/ReportComponent';
import { AlertProvider } from './context/AlertContext';
import ServerErrorComponent from './pages/ServerErrorComponent'; // Crear este componente para manejar errores del servidor
import TicTacToeComponent from './pages/TicTacToeComponent';
import DashboardComponent from './pages/DashboardComponent';
const App = () => {
  const serverStatus = useServerStatus();

  if (!serverStatus) {
    return <ServerErrorComponent />;
  }

  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <div className='App'>
            <Routes>
              <Route path='/' element={<LoginComponent />} />
              <Route path='/menu' element={<ProtectedRoute element={<MenuComponent />} />} />
              <Route path='/management-user' element={<ProtectedRoute element={<ManagementUserComponent />} />} />
              <Route path='/profile' element={<ProtectedRoute element={<ProfileComponent />} />} />
              <Route path='/inventory' element={<ProtectedRoute element={<InventoryComponent />} />} />
              <Route path='/production' element={<ProtectedRoute element={<ProductionComponent />} />} />
              <Route path='/production-register' element={<ProtectedRoute element={<RegisterProductionComponent />} />} />
              <Route path='/production-stage' element={<ProtectedRoute element={<ProductionStageComponent />} />} />
              <Route path='/sales' element={<ProtectedRoute element={<SalesComponent />} />} />
              <Route path='/drawBack' element={<ProtectedRoute element={<DrawBackComponent />} />} />
              <Route path='/predictions' element={<ProtectedRoute element={<PredictionsComponent />} />} />
              <Route path='/report' element={<ProtectedRoute element={<ReportComponent />} />} />
              <Route path='/management-roles' element={<ProtectedRoute element={<ManagementRolesComponent />} />} />
              <Route path='/password-reset' element={<PasswordResetComponent />} /> 
              <Route path='/dashboard' element={<DashboardComponent />} /> 
              <Route path='/game' element={<ProtectedRoute element={<TicTacToeComponent />} />} /> {/* Nueva ruta */}
            </Routes>
          </div>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
};

export default App;