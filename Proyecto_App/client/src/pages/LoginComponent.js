import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { authenticateUser } from '../services/authService';
import '../utils/StylesTotal.css';
import PasswordResetModal from './PasswordResetModal'; // Importar el modal

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await authenticateUser(email, password);
      if (userData) {
        await login(userData);
        alert('Usuario Logeado Correctamente');
        navigate('/menu');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Ocurrió un error');
    }
  };

  if (user) {
    return <Navigate to="/menu" />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Ingreso de Usuario</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Correo:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Clave:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Ingresar</button>
        </form>
        <div className="password-reset-link">
          <button onClick={() => setIsModalOpen(true)}>Olvidé mi contraseña</button>
        </div>
      </div>
      <PasswordResetModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LoginComponent;
