// SalesComponent.js
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import { validateSalesFormData } from '../services/salesService';

const SalesComponent = () => {
  const [formData, setFormData] = useState({
    id_usuario: '',
    id_producto: '',
    descripcion: '',
    cantidad: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);

  useEffect(() => {
    getVentas();
    getUsuarios();
    getProductos();
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
      id_usuario: '',
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
    <div>
      <h1>Gestión de Ventas</h1>
      <h2>Venta Management</h2>
      <form onSubmit={addVenta} className="s-form">
        <select name="id_usuario" value={formData.id_usuario} onChange={handleInputChange}>
          <option value="">Selecciona un Usuario</option>
          {usuarios.map(usuario => (
            <option key={usuario.id_usuario} value={usuario.id_usuario}>{usuario.nombre_usuario}</option>
          ))}
        </select>
        {formErrors.id_usuario && <span className="error">{formErrors.id_usuario}</span>}
        <br/>
        <select name="id_producto" value={formData.id_producto} onChange={handleInputChange}>
          <option value="">Selecciona un Producto</option>
          {productos.map(producto => (
            <option key={producto.id_producto} value={producto.id_producto}>{producto.nombre}</option>
          ))}
        </select>
        {formErrors.id_producto && <span className="error">{formErrors.id_producto}</span>}
        <br/>
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
        {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
        <br/>
        <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleInputChange} />
        {formErrors.cantidad && <span className="error">{formErrors.cantidad}</span>}
        <br/>
        <button type="submit">{editing ? "Actualizar Venta" : "Agregar Venta"}</button> 
      </form>
      <h2>Lista de Ventas</h2>
      <table className="s-table">
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
            const usuario = usuarios.find(u => u.id_usuario === venta.id_usuario);
            const producto = productos.find(p => p.id_producto === venta.id_producto);
            return (
              <tr key={venta.id_venta}>
                <td>{venta.id_venta}</td>
                <td>{usuario ? usuario.nombre_usuario : 'Usuario no encontrado'}</td>
                <td>{producto ? producto.nombre : 'Producto no encontrado'}</td>
                <td>{venta.descripcion}</td>
                <td>{venta.cantidad}</td>
                <td>
                  <button onClick={() => editVenta(venta)}>Editar</button>
                  <button onClick={() => deleteVenta(venta.id_venta)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
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

export default SalesComponent;
