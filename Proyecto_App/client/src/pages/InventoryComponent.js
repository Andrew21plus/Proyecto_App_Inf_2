// InventoryComponent.js
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateInventarioPTFormData, validateInventarioMPFormData } from '../services/inventoryService';

const InventoryComponent = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedSubForm, setSelectedSubForm] = useState(null);
  const [inventarioProductoTerminado, setInventarioProductoTerminado] = useState([]);
  const [inventarioMateriaPrima, setInventarioMateriaPrima] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [formData, setFormData] = useState({
    id_produccion: '',
    nombre: '',
    cantidad_disponible: ''
  });
  const [usuarioMateriaPrimaData, setUsuarioMateriaPrimaData] = useState({
    id_materia_prima: '',
    cantidad_nuevo_ingreso: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingPT, setEditingPT] = useState(false);
  const { id_usuario } = useAuth();

  useEffect(() => {
    fetchInventarioPT();
    fetchInventarioMateriaPrima();
    fetchProducciones();
  }, []);

  const fetchInventarioPT = () => {
    Axios.get('http://localhost:3307/inventario-producto-terminado')
      .then(response => setInventarioProductoTerminado(response.data))
      .catch(error => console.error('Error fetching inventario PT', error));
  };

  const fetchInventarioMateriaPrima = () => {
    Axios.get('http://localhost:3307/inventario-materia-prima')
      .then(response => setInventarioMateriaPrima(response.data))
      .catch(error => console.error('Error fetching inventario MP', error));
  };

  const fetchProducciones = () => {
    Axios.get('http://localhost:3307/producciones')
      .then(response => setProducciones(response.data))
      .catch(error => console.error('Error fetching producciones', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsuarioMateriaPrimaInputChange = (e) => {
    const { name, value } = e.target;
    setUsuarioMateriaPrimaData({ ...usuarioMateriaPrimaData, [name]: value });
  };

  const handleAddUsuarioMateriaPrima = (e) => {
    e.preventDefault();
    
    const errors = validateInventarioMPFormData(usuarioMateriaPrimaData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const usuarioMateriaPrimaPayload = {
      ...usuarioMateriaPrimaData,
      id_usuario: id_usuario,
      fecha_ingreso: new Date().toISOString().split('T')[0]
    };

    Axios.post("http://localhost:3307/usuario-materia-prima", usuarioMateriaPrimaPayload)
      .then(() => {
        alert("Materia Prima Añadida");

        const selectedMateriaPrima = inventarioMateriaPrima.find(mp => mp.id_materia_prima === usuarioMateriaPrimaData.id_materia_prima);
        const updatedCantidadDisponible = parseInt(selectedMateriaPrima.cantidad_disponible) + parseInt(usuarioMateriaPrimaData.cantidad_nuevo_ingreso);

        Axios.put(`http://localhost:3307/inventario-materia-prima/${usuarioMateriaPrimaData.id_materia_prima}`, {
          ...selectedMateriaPrima,
          cantidad_disponible: updatedCantidadDisponible
        }).then(() => {
          alert("Inventario Actualizado");
          setUsuarioMateriaPrimaData({
            id_materia_prima: '',
            cantidad_nuevo_ingreso: ''
          });
          fetchInventarioMateriaPrima();
        }).catch(error => {
          console.error("Error actualizando inventario", error);
          alert("Error actualizando inventario");
        });
      })
      .catch(error => {
        console.error("Error añadiendo usuario materia prima", error);
        alert("Error añadiendo usuario materia prima");
      });
  };

  const addInventarioPT = (e) => {
    e.preventDefault();

    const errors = validateInventarioPTFormData(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    Axios.post("http://localhost:3307/inventario-producto-terminado", formData)
      .then(() => {
        alert("Inventario Producto Terminado Añadido");
        setFormData({ id_produccion: '', nombre: '', cantidad_disponible: '' });
        fetchInventarioPT();
      })
      .catch(error => {
        console.error("Error añadiendo inventario PT", error);
        alert("Error añadiendo inventario PT");
      });
  };

  const editInventarioPT = (inventarioPT) => {
    setFormData(inventarioPT);
    setEditingPT(true);
  };

  const deleteInventarioPT = (id_producto) => {
    Axios.delete(`http://localhost:3307/inventario-producto-terminado/${id_producto}`)
      .then(() => {
        alert("Inventario Producto Terminado Eliminado");
        fetchInventarioPT();
      })
      .catch(error => {
        console.error("Error eliminando inventario PT", error);
        alert("Error eliminando inventario PT");
      });
  };

  const editInventarioMP = (inventarioMP) => {
    // Añadir lógica para editar inventario materia prima
  };

  const deleteInventarioMP = (id_materia_prima) => {
    Axios.delete(`http://localhost:3307/inventario-materia-prima/${id_materia_prima}`)
      .then(() => {
        alert("Inventario Materia Prima Eliminado");
        fetchInventarioMateriaPrima();
      })
      .catch(error => {
        console.error("Error eliminando inventario MP", error);
        alert("Error eliminando inventario MP");
      });
  };

  return (
    <div>
      <h1>Gestión de Inventario</h1>
      <div className="form-selector">
        <button onClick={() => setSelectedForm('PT')}>Inventario Producto Terminado</button>
        <button onClick={() => setSelectedForm('MP')}>Inventario Materia Prima</button>
      </div>
      {selectedForm === 'MP' && (
        <div>
          <button onClick={() => setSelectedSubForm('listaMP')}>Lista de Inventario Materia Prima</button>
          <button onClick={() => setSelectedSubForm('addMP')}>Añadir Materia Prima</button>
        </div>
      )}
      {selectedForm === 'PT' && (
        <div>
          <h2>Inventario Producto Terminado</h2>
          <form onSubmit={addInventarioPT} className="s-form">
            <select name="id_produccion" value={formData.id_produccion} onChange={handleInputChange}>
              <option value="">Selecciona una Producción</option>
              {producciones.map(produccion => (
                <option key={produccion.id_produccion} value={produccion.id_produccion}>{produccion.id_produccion}</option>
              ))}
            </select>
            {formErrors.id_produccion && <span className="error">{formErrors.id_produccion}</span>}
            <br/>
            <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} />
            {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
            <br/>
            <input type="text" name="cantidad_disponible" placeholder="Cantidad Disponible" value={formData.cantidad_disponible} onChange={handleInputChange} />
            {formErrors.cantidad_disponible && <span className="error">{formErrors.cantidad_disponible}</span>}
            <br/>
            <button type="submit">{editingPT ? 'Actualizar' : 'Agregar'}</button>
          </form>
          <h3>Lista de Inventario Producto Terminado</h3>
          <table className="s-table">
            <thead>
              <tr>
                <th>ID Producto</th>
                <th>ID Producción</th>
                <th>Nombre</th>
                <th>Cantidad Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarioProductoTerminado.map(inventarioPT => (
                <tr key={inventarioPT.id_producto}>
                  <td>{inventarioPT.id_producto}</td>
                  <td>{inventarioPT.id_produccion}</td>
                  <td>{inventarioPT.nombre}</td>
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
      {selectedForm === 'MP' && selectedSubForm === 'listaMP' && (
        <div>
          <h2>Inventario Materia Prima</h2>
          <h3>Lista de Inventario Materia Prima</h3>
          <table className="s-table">
            <thead>
              <tr>
                <th>ID Materia Prima</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Proveedor</th>
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
      {selectedForm === 'MP' && selectedSubForm === 'addMP' && (
        <div>
          <h2>Añadir Materia Prima</h2>
          <form onSubmit={handleAddUsuarioMateriaPrima} className="s-form">
            <select name="id_materia_prima" value={usuarioMateriaPrimaData.id_materia_prima} onChange={handleUsuarioMateriaPrimaInputChange}>
              <option value="">Selecciona una Materia Prima</option>
              {inventarioMateriaPrima.map(materiaPrima => (
                <option key={materiaPrima.id_materia_prima} value={materiaPrima.id_materia_prima}>{materiaPrima.nombre}</option>
              ))}
            </select>
            {formErrors.id_materia_prima && <span className="error">{formErrors.id_materia_prima}</span>}
            <input type="number" name="cantidad_nuevo_ingreso" placeholder="Cantidad Nuevo Ingreso" value={usuarioMateriaPrimaData.cantidad_nuevo_ingreso} onChange={handleUsuarioMateriaPrimaInputChange} />
            {formErrors.cantidad_nuevo_ingreso && <span className="error">{formErrors.cantidad_nuevo_ingreso}</span>}
            <button type="submit">Añadir</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default InventoryComponent;
