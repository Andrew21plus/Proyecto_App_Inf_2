import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { authenticateUser } from '../services/authService'; // Importa el servicio de autenticación

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await authenticateUser(email, password); // Usa el servicio de autenticación

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

  // Redirigir automáticamente si ya está autenticado
  if (user) {
    return <Navigate to="/menu" />;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginComponent;




