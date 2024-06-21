// src/pages/PasswordResetComponent.js
import React, { useState } from 'react';
//import { sendPasswordResetEmail } from '../services/authService'; // Servicio para recuperar pass

const PasswordResetComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      //await sendPasswordResetEmail(email);
      setMessage('Se ha enviado un correo para restablecer tu contraseña.');
    } catch (err) {
      setError('Ocurrió un error al enviar el correo.');
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handlePasswordReset}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default PasswordResetComponent;
