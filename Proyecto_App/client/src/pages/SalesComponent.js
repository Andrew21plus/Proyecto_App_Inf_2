import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import { validateSalesFormData } from '../services/salesService';
import { useAuth } from '../context/AuthContext';  // Importa el contexto de autenticación
import '../utils/StylesTotal.css';  // Asegúrate de que el archivo CSS correcto esté importado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';

const SalesComponent = () => {
  const { user } = useAuth();  // Obtén el usuario del contexto de autenticación
  const [formData, setFormData] = useState({
    id_usuario: '',
    id_producto: '',
    descripcion: '',
    cantidad: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);

  useEffect(() => {
    getVentas();
    getProductos();

    // Establece el usuario automáticamente
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_usuario: user.id_usuario
      }));
    }
  }, [user]);

  const getVentas = () => {
    Axios.get("http://localhost:3307/ventas")
      .then(response => {
        setVentas(response.data);
      })
      .catch(error => {
        console.error('Error fetching ventas:', error);
      });
  };

  const getProductos = () => {
    Axios.get("http://localhost:3307/inventario-producto-terminado")
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error fetching productos:', error);
      });
  };

  const addVenta = (e) => {
    e.preventDefault();
    const errors = validateSalesFormData(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const dataToSend = {
      id_usuario: parseInt(formData.id_usuario),
      id_producto: parseInt(formData.id_producto),
      descripcion: formData.descripcion,
      cantidad: parseInt(formData.cantidad)
    };

    Axios.get(`http://localhost:3307/inventario-producto-terminado/${dataToSend.id_producto}`)
      .then(response => {
        const producto = response.data;
        if (producto.cantidad_disponible < dataToSend.cantidad) {
          alert("La cantidad de venta no puede ser mayor que la cantidad disponible en inventario.");
          return;
        }

        if (editing) {
          Axios.put(`http://localhost:3307/ventas/${currentVenta.id_venta}`, dataToSend)
            .then(() => {
              updateInventarioProductoTerminado(dataToSend.id_producto, producto.cantidad_disponible - dataToSend.cantidad);
              alert("Venta Actualizada");
              resetForm();
              getVentas();
            })
            .catch(error => {
              console.error('Error actualizando la venta:', error);
            });
        } else {
          Axios.post("http://localhost:3307/ventas", dataToSend)
            .then(() => {
              updateInventarioProductoTerminado(dataToSend.id_producto, producto.cantidad_disponible - dataToSend.cantidad);
              alert("Venta Registrada");
              resetForm();
              getVentas();
            })
            .catch(error => {
              console.error('Error registrando la venta:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error fetching producto:', error);
      });
  };

  const updateInventarioProductoTerminado = (id_producto, nuevaCantidad) => {
    Axios.put(`http://localhost:3307/inventario-producto-terminado/${id_producto}`, { cantidad_disponible: nuevaCantidad })
      .then(() => {
        getProductos();
      })
      .catch(error => {
        console.error('Error actualizando inventario_producto_terminado:', error);
      });
  };

  const resetForm = () => {
    setFormData({
      id_usuario: user ? user.id_usuario : '',  // Restaura el usuario actual
      id_producto: '',
      descripcion: '',
      cantidad: ''
    });
    setEditing(false);
    setCurrentVenta(null);
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
      id_usuario: venta.id_usuario.toString(),
      id_producto: venta.id_producto.toString(),
      descripcion: venta.descripcion,
      cantidad: venta.cantidad.toString()
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' }); // Clear the error when the user modifies the field
  };

  return (
    <div className="production-container"> {/* Cambia la clase del contenedor */}
      <h1>Gestión de Ventas</h1>
      <h2>Venta Management</h2>
      <form onSubmit={addVenta} className="production-form"> {/* Cambia la clase del formulario */}
        <input type="text" name="id_usuario" value={user ? user.nombre_usuario : ''} disabled className="input-field" />
        <br/>
        <select name="id_producto" value={formData.id_producto} onChange={handleInputChange} className="input-field">
          <option value="">Selecciona un Producto</option>
          {productos.map(producto => (
            <option key={producto.id_producto} value={producto.id_producto}>{producto.nombre}</option>
          ))}
        </select>
        {formErrors.id_producto && <span className="error">{formErrors.id_producto}</span>}
        <br/>
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} className="input-field" />
        {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
        <br/>
        <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleInputChange} className="input-field" />
        {formErrors.cantidad && <span className="error">{formErrors.cantidad}</span>}
        <br/>
        <button type="submit" className="submit-button icon-button">
          {editing ? <><FontAwesomeIcon icon={faSave} /> Actualizar Venta</> : <><FontAwesomeIcon icon={faPlus} /> Agregar Venta</>}
        </button>
      </form>
      <h2>Lista de Ventas</h2>
      <table className="production-table"> {/* Cambia la clase de la tabla */}
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Usuario</th>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(venta => {
            const producto = productos.find(p => p.id_producto === venta.id_producto);
            return (
              <tr key={venta.id_venta}>
                <td data-label="ID Venta">{venta.id_venta}</td>
                <td data-label="Usuario">{user ? user.nombre_usuario : venta.id_usuario}</td>
                <td data-label="Producto">{producto ? producto.nombre : venta.id_producto}</td>
                <td data-label="Descripción">{venta.descripcion}</td>
                <td data-label="Cantidad">{venta.cantidad}</td>
                <td data-label="Acciones">
                  <button className="edit-button icon-button" onClick={() => editVenta(venta)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="delete-button icon-button" onClick={() => deleteVenta(venta.id_venta)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SalesComponent;
