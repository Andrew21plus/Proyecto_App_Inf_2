import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../utils/Styles.css'; 

const VentasComponent = () => {
  const [formData, setFormData] = useState({
    id_usuario: '',
    descripcion: '',
    cantidad: ''
  });
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);

  useEffect(() => {
    getVentas();
    getUsuarios();
  }, []);

  const getVentas = () => {
    Axios.get("http://localhost:3307/ventas")
      .then(response => {
        setVentas(response.data);
      })
      .catch(error => {
        console.error('Error fetching ventas:', error);
      });
  };

  const getUsuarios = () => {
    Axios.get("http://localhost:3307/usuarios")
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios:', error);
      });
  };

  const addVenta = (e) => {
    e.preventDefault();
    const dataToSend = {
      id_usuario: parseInt(formData.id_usuario),
      descripcion: formData.descripcion,
      cantidad: parseInt(formData.cantidad)
    };

    if (editing) {
      Axios.put(`http://localhost:3307/ventas/${currentVenta.id_venta}`, dataToSend)
        .then(() => {
          alert("Venta Actualizada");
          setFormData({
            id_usuario: '',
            descripcion: '',
            cantidad: ''
          });
          setEditing(false);
          setCurrentVenta(null);
          getVentas();
        })
        .catch(error => {
          console.error('Error actualizando la venta:', error);
        });
    } else {
      Axios.post("http://localhost:3307/ventas", dataToSend)
        .then(() => {
          alert("Venta Registrada");
          setFormData({
            id_usuario: '',
            descripcion: '',
            cantidad: ''
          });
          getVentas();
        })
        .catch(error => {
          console.error('Error registrando la venta:', error);
        });
    }
  };

  const deleteVenta = (id) => {
    Axios.delete(`http://localhost:3307/ventas/${id}`)
      .then(() => {
        alert("Venta Eliminada");
        getVentas();
      })
      .catch(error => {
        console.error('Error eliminando la venta:', error);
      });
  };

  const editVenta = (venta) => {
    setEditing(true);
    setCurrentVenta(venta);
    setFormData({
      id_usuario: venta.id_usuario.toString(), // Convertir a string para el input
      descripcion: venta.descripcion,
      cantidad: venta.cantidad.toString() // Convertir a string para el input
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Venta Management</h2>
      <form onSubmit={addVenta} className="s-form">
        <select name="id_usuario" value={formData.id_usuario} onChange={handleInputChange}>
          <option value="">Selecciona un Usuario</option>
          {usuarios.map(usuario => (
            <option key={usuario.id_usuario} value={usuario.id_usuario}>{usuario.nombre_usuario}</option>
          ))}
        </select>
        <br/>
        <br/>
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
        <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Venta" : "Agregar Venta"}</button> 
      </form>
      <h2>Lista de Ventas</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>ID Usuario</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(venta => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{venta.id_usuario}</td>
              <td>{venta.descripcion}</td>
              <td>{venta.cantidad}</td>
              <td>
                <button onClick={() => editVenta(venta)}>Editar</button>
                <button onClick={() => deleteVenta(venta.id_venta)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div> 
        <Link to="/"> 
          <br/>
          <button>Volver a la página principal</button>
        </Link>
      </div>
    </div>
  );
};

export default VentasComponent;
