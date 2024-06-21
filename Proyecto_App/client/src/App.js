import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './utils/App.css';
import LoginComponent from './pages/LoginComponent';
import MenuComponent from './pages/MenuComponent';
import ManagementUserComponent from './pages/ManagementUserComponent';
import ProfileComponent from './pages/ProfileComponent';
import InventoryComponent from './pages/InventoryComponent';
import ProductionComponent from './pages/ProductionComponent';
import ProductionStageComponent from './pages/ProductionStageComponent';
import SalesComponent from './pages/SalesComponent';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DrawBackComponent from './pages/DrawBackComponent';
import PredictionsComponent from './pages/PredictionsComponent';
import PasswordResetComponent from './pages/PasswordResetComponent';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <Routes>
            <Route path='/' element={<LoginComponent />} />
            <Route path='/menu' element={<ProtectedRoute element={<MenuComponent />} />} />
            <Route path='/management-user' element={<ProtectedRoute element={<ManagementUserComponent />} />} />
            <Route path='/profile' element={<ProtectedRoute element={<ProfileComponent />} />} />
            <Route path='/inventory' element={<ProtectedRoute element={<InventoryComponent />} />} />
            <Route path='/production' element={<ProtectedRoute element={<ProductionComponent />} />} />
            <Route path='/production-stage' element={<ProtectedRoute element={<ProductionStageComponent />} />} />
            <Route path='/sales' element={<ProtectedRoute element={<SalesComponent />} />} />
            <Route path='/drawBack' element={<ProtectedRoute element={<DrawBackComponent />} />} />
            <Route path='/predictions' element={<ProtectedRoute element={<PredictionsComponent />} />} />
            <Route path='/password-reset' element={<PasswordResetComponent />} /> 
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;


