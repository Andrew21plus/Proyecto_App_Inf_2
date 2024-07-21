import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { validateSalesFormData } from '../services/salesService';
import { useAuth } from '../context/AuthContext';  // Importa el contexto de autenticación
import '../utils/StylesTotal.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSave, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

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

  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const itemsPerPage = 15; // Número de ventas por página

  // Estados para la ordenación
  const [sortConfig, setSortConfig] = useState({ key: 'id_venta', direction: 'asc' });

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

  const sortVentas = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedVentas = [...ventas].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = sortedVentas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(ventas.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="pagination">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-link ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />;
    }
    return <FontAwesomeIcon icon={faSort} />;
  };

  return (
    <div className="production-container"> {/* Cambia la clase del contenedor */}
      <h1>Gestión de Ventas</h1>
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
            <th onClick={() => sortVentas('id_usuario')}>
              Usuario {getSortIcon('id_usuario')}
            </th>
            <th onClick={() => sortVentas('id_producto')}>
              Producto {getSortIcon('id_producto')}
            </th>
            <th onClick={() => sortVentas('descripcion')}>
              Descripción {getSortIcon('descripcion')}
            </th>
            <th onClick={() => sortVentas('cantidad')}>
              Cantidad {getSortIcon('cantidad')}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentVentas.map(venta => {
            const producto = productos.find(p => p.id_producto === venta.id_producto);
            return (
              <tr key={venta.id_venta}>
                <td>{user && user.nombre_usuario}</td>
                <td>{producto ? producto.nombre : 'Producto no encontrado'}</td>
                <td>{venta.descripcion}</td>
                <td>{venta.cantidad}</td>
                <td>
                  <button onClick={() => editVenta(venta)} className="icon-button"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => deleteVenta(venta.id_venta)} className="icon-button"><FontAwesomeIcon icon={faTrashAlt} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {renderPagination()} {/* Renderizar la paginación */}
    </div>
  );
};

export default SalesComponent;
