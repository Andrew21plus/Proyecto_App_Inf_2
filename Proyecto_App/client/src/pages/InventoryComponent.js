// InventoryComponent.js
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
//import './styles.css'; 
import { validateInventarioPTFormData, validateInventarioMPFormData } from '../services/inventoryService';

const InventoryComponent = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({
    id_produccion: '',
    id_venta: '',
    cantidad_disponible: '',
    nombre: '',
    descripcion: '',
    proveedor: '',
    cantidad_ingreso: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [inventarioProductoTerminado, setInventarioProductoTerminado] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [inventarioMateriaPrima, setInventarioMateriaPrima] = useState([]);
  const [editingPT, setEditingPT] = useState(false);
  const [editingMP, setEditingMP] = useState(false);
  const [currentInventarioPT, setCurrentInventarioPT] = useState(null);
  const [currentInventarioMP, setCurrentInventarioMP] = useState(null);

  useEffect(() => {
    getInventarioProductoTerminado();
    getProducciones();
    getVentas();
    getInventarioMateriaPrima();
  }, []);

  const getInventarioProductoTerminado = () => {
    Axios.get("http://localhost:3307/inventario-producto-terminado")
      .then(response => {
        setInventarioProductoTerminado(response.data);
      })
      .catch(error => {
        console.error('Error fetching inventario_producto_terminado:', error);
      });
  };

  const getProducciones = () => {
    Axios.get("http://localhost:3307/produccion")
      .then(response => {
        setProducciones(response.data);
      })
      .catch(error => {
        console.error('Error fetching producciones:', error);
      });
  };

  const getVentas = () => {
    Axios.get("http://localhost:3307/ventas")
      .then(response => {
        setVentas(response.data);
      })
      .catch(error => {
        console.error('Error fetching ventas:', error);
      });
  };

  const getInventarioMateriaPrima = () => {
    Axios.get("http://localhost:3307/inventario-materia-prima")
      .then(response => {
        setInventarioMateriaPrima(response.data);
      })
      .catch(error => {
        console.error('Error fetching inventario_materia_prima:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' }); // Clear the error when the user modifies the field
  };

  const addInventarioPT = (e) => {
    e.preventDefault();
    const errors = validateInventarioPTFormData(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    if (editingPT) {
      Axios.put(`http://localhost:3307/inventario-producto-terminado/${currentInventarioPT.id_producto}`, formData)
        .then(() => {
          alert("Inventario Producto Terminado Actualizado");
          setFormData({
            id_produccion: '',
            id_venta: '',
            cantidad_disponible: ''
          });
          setEditingPT(false);
          setCurrentInventarioPT(null);
          getInventarioProductoTerminado();
        })
        .catch(error => {
          console.error('Error actualizando inventario_producto_terminado:', error);
        });
    } else {
      Axios.post("http://localhost:3307/inventario-producto-terminado", formData)
        .then(() => {
          alert("Inventario Producto Terminado Registrado");
          setFormData({
            id_produccion: '',
            id_venta: '',
            cantidad_disponible: ''
          });
          getInventarioProductoTerminado();
        })
        .catch(error => {
          console.error('Error registrando inventario_producto_terminado:', error);
        });
    }
  };

  const addInventarioMP = (e) => {
    e.preventDefault();
    const errors = validateInventarioMPFormData(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    if (editingMP) {
      Axios.put(`http://localhost:3307/inventario-materia-prima/${currentInventarioMP.id_materia_prima}`, formData)
        .then(() => {
          alert("Inventario Materia Prima Actualizado");
          setFormData({
            nombre: '',
            descripcion: '',
            proveedor: '',
            cantidad_ingreso: '',
            cantidad_disponible: ''
          });
          setEditingMP(false);
          setCurrentInventarioMP(null);
          getInventarioMateriaPrima();
        })
        .catch(error => {
          console.error('Error actualizando inventario_materia_prima:', error);
        });
    } else {
      Axios.post("http://localhost:3307/inventario-materia-prima", formData)
        .then(() => {
          alert("Inventario Materia Prima Registrado");
          setFormData({
            nombre: '',
            descripcion: '',
            proveedor: '',
            cantidad_ingreso: '',
            cantidad_disponible: ''
          });
          getInventarioMateriaPrima();
        })
        .catch(error => {
          console.error('Error registrando inventario_materia_prima:', error);
        });
    }
  };

  const deleteInventarioPT = (id) => {
    Axios.delete(`http://localhost:3307/inventario-producto-terminado/${id}`)
      .then(() => {
        alert("Inventario Producto Terminado Eliminado");
        getInventarioProductoTerminado();
      })
      .catch(error => {
        console.error('Error eliminando inventario_producto_terminado:', error);
      });
  };

  const deleteInventarioMP = (id) => {
    Axios.delete(`http://localhost:3307/inventario-materia-prima/${id}`)
      .then(() => {
        alert("Inventario Materia Prima Eliminado");
        getInventarioMateriaPrima();
      })
      .catch(error => {
        console.error('Error eliminando inventario_materia_prima:', error);
      });
  };

  const editInventarioPT = (inventarioPT) => {
    setEditingPT(true);
    setCurrentInventarioPT(inventarioPT);
    setFormData({
      id_produccion: inventarioPT.id_produccion,
      id_venta: inventarioPT.id_venta,
      cantidad_disponible: inventarioPT.cantidad_disponible
    });
  };

  const editInventarioMP = (inventarioMP) => {
    setEditingMP(true);
    setCurrentInventarioMP(inventarioMP);
    setFormData({
      nombre: inventarioMP.nombre,
      descripcion: inventarioMP.descripcion,
      proveedor: inventarioMP.proveedor,
      cantidad_ingreso: inventarioMP.cantidad_ingreso,
      cantidad_disponible: inventarioMP.cantidad_disponible
    });
  };

  return (
    <div>
      <h1>Gestión de Inventario</h1>
      <div className="form-selector">
        <button onClick={() => setSelectedForm('PT')}>Inventario Producto Terminado</button>
        <button onClick={() => setSelectedForm('MP')}>Inventario Materia Prima</button>
      </div>
      {selectedForm === 'PT' && (
        <div>
          <h2>Inventario Producto Terminado Management</h2>
          <form onSubmit={addInventarioPT} className="s-form">
            <select name="id_produccion" value={formData.id_produccion} onChange={handleInputChange}>
              <option value="">Selecciona una Producción</option>
              {producciones.map(produccion => (
                <option key={produccion.id_produccion} value={produccion.id_produccion}>{produccion.id_produccion}</option>
              ))}
            </select>
            {formErrors.id_produccion && <span className="error">{formErrors.id_produccion}</span>}
            <br/>
            <br/>
            <select name="id_venta" value={formData.id_venta} onChange={handleInputChange}>
              <option value="">Selecciona una Venta</option>
              {ventas.map(venta => (
                <option key={venta.id_venta} value={venta.id_venta}>{venta.id_venta}</option>
              ))}
            </select>
            {formErrors.id_venta && <span className="error">{formErrors.id_venta}</span>}
            <br/>
            <br/>
            <input type="text" name="cantidad_disponible" placeholder="Cantidad Disponible" value={formData.cantidad_disponible} onChange={handleInputChange} />
            {formErrors.cantidad_disponible && <span className="error">{formErrors.cantidad_disponible}</span>}
            <br/>
            <button type="submit">{editingPT ? "Actualizar Inventario Producto Terminado" : "Agregar Inventario Producto Terminado"}</button> 
          </form>
          <h2>Lista de Inventario Producto Terminado</h2>
          <table className="s-table">
            <thead>
              <tr>
                <th>ID Producto</th>
                <th>ID Producción</th>
                <th>ID Venta</th>
                <th>Cantidad Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarioProductoTerminado.map(inventarioPT => (
                <tr key={inventarioPT.id_producto}>
                  <td>{inventarioPT.id_producto}</td>
                  <td>{inventarioPT.id_produccion}</td>
                  <td>{inventarioPT.id_venta}</td>
                  <td>{inventarioPT.cantidad_disponible}</td>
                  <td>
                    <button onClick={() => editInventarioPT(inventarioPT)}>Editar</button>
                    <button onClick={() => deleteInventarioPT(inventarioPT.id_producto)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedForm === 'MP' && (
        <div>
          <h2>Inventario Materia Prima Management</h2>
          <form onSubmit={addInventarioMP} className="s-form">
            <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} />
            {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
            <br/>
            <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
            {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
            <br/>
            <input type="text" name="proveedor" placeholder="Proveedor" value={formData.proveedor} onChange={handleInputChange} />
            {formErrors.proveedor && <span className="error">{formErrors.proveedor}</span>}
            <br/>
            <input type="text" name="cantidad_ingreso" placeholder="Cantidad Ingreso" value={formData.cantidad_ingreso} onChange={handleInputChange} />
            {formErrors.cantidad_ingreso && <span className="error">{formErrors.cantidad_ingreso}</span>}
            <br/>
            <input type="text" name="cantidad_disponible" placeholder="Cantidad Disponible" value={formData.cantidad_disponible} onChange={handleInputChange} />
            {formErrors.cantidad_disponible && <span className="error">{formErrors.cantidad_disponible}</span>}
            <br/>
            <button type="submit">{editingMP ? "Actualizar Inventario Materia Prima" : "Agregar Inventario Materia Prima"}</button> 
          </form>
          <h2>Lista de Inventario Materia Prima</h2>
          <table className="s-table">
            <thead>
              <tr>
                <th>ID Materia Prima</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Proveedor</th>
                <th>Cantidad Ingreso</th>
                <th>Cantidad Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarioMateriaPrima.map(inventarioMP => (
                <tr key={inventarioMP.id_materia_prima}>
                  <td>{inventarioMP.id_materia_prima}</td>
                  <td>{inventarioMP.nombre}</td>
                  <td>{inventarioMP.descripcion}</td>
                  <td>{inventarioMP.proveedor}</td>
                  <td>{inventarioMP.cantidad_ingreso}</td>
                  <td>{inventarioMP.cantidad_disponible}</td>
                  <td>
                    <button onClick={() => editInventarioMP(inventarioMP)}>Editar</button>
                    <button onClick={() => deleteInventarioMP(inventarioMP.id_materia_prima)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/"> 
          <br/>
          <button>Volver a la página principal</button>
      </Link>
    </div>
  );
};

export default InventoryComponent;
