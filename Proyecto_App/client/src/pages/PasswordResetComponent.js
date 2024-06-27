import React, { useState } from 'react';

const PasswordResetComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3307/usuarios/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Se ha enviado un correo para restablecer tu contraseña.');
        setError('');
      } else {
        setError('Ocurrió un error al enviar el correo.');
        setMessage('');
      }
    } catch (err) {
      setError('Ocurrió un error al enviar el correo.');
      setMessage('');
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
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default PasswordResetComponent;
