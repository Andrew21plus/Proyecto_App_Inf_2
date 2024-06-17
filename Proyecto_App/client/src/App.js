// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './utils/App.css';
import LoginComponent from './pages/LoginComponent';
import MenuComponent from './pages/MenuComponent';
import CreateUserComponent from './pages/CreateUserComponent'; // Importa el componente CreateUserComponent
import ProfileComponent from './pages/ProfileComponent'; // Importa el componente ProfileComponent
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente ProtectedRoute

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <Routes>
            <Route path='/' element={<LoginComponent />} />
            <Route path='/menu' element={<ProtectedRoute element={<MenuComponent />} />} /> {/* Usa ProtectedRoute */}
            <Route path='/create-user' element={<ProtectedRoute element={<CreateUserComponent />} />} /> {/* Ruta protegida */}
            <Route path='/profile' element={<ProtectedRoute element={<ProfileComponent />} />} /> {/* Ruta protegida */}
            {/* Otras rutas pueden ir aquí */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

