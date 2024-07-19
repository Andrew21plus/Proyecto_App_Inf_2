// src/components/Modal.js
import React from 'react';
import '../utils/Modal.css';

const Modal = ({ show, handleClose, children, handleReload }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className='modal-main'>
        {children}
        <div className='modal-buttons'>
          <button className='close-button' onClick={handleClose}>Cerrar</button>
          <br/>
          <button className='reload-button' onClick={handleReload}>Reiniciar Juego</button>
        </div>
      </section>
    </div>
  );
};

export default Modal;
