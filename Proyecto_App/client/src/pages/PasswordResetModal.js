import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Establecer el elemento raíz para accesibilidad

const PasswordResetModal = ({ isOpen, onRequestClose }) => {
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

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      position: 'relative',
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      width: '400px',
      maxWidth: '100%',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      border: 'none',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'transparent',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
    },
    button: {
      padding: '10px 15px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
      width: '100%',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    message: {
      color: 'green',
      marginTop: '10px',
      textAlign: 'center',
    },
    error: {
      color: 'red',
      marginTop: '10px',
      textAlign: 'center',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Restablecer Contraseña" style={customStyles}>
      <button onClick={onRequestClose} style={customStyles.closeButton}>X</button>
      <h2 style={{ textAlign: 'center' }}>Recuperar Contraseña</h2>
      <form onSubmit={handlePasswordReset}>
        <div style={customStyles.formGroup}>
          <label style={customStyles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={customStyles.input}
          />
        </div>
        {message && <p style={customStyles.message}>{message}</p>}
        {error && <p style={customStyles.error}>{error}</p>}
        <button type="submit" style={customStyles.button}>Enviar</button>
      </form>
    </Modal>
  );
};

export default PasswordResetModal;