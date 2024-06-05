import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../utils/Styles.css'; 

const InventarioPTComponent = () => {
  const [formData, setFormData] = useState({
    id_produccion: '',
    id_venta: '',
    cantidad_disponible: ''
  });
  const [inventarioProductoTerminado, setInventarioProductoTerminado] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentInventarioPT, setCurrentInventarioPT] = useState(null);

  useEffect(() => {
    getInventarioProductoTerminado();
    getProducciones();
    getVentas();
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

  const addInventarioPT = (e) => {
    e.preventDefault();
    if (editing) {
      Axios.put(`http://localhost:3307/inventario-producto-terminado/${currentInventarioPT.id_producto}`, formData)
        .then(() => {
          alert("Inventario Producto Terminado Actualizado");
          setFormData({
            id_produccion: '',
            id_venta: '',
            cantidad_disponible: ''
          });
          setEditing(false);
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

  const editInventarioPT = (inventarioPT) => {
    setEditing(true);
    setCurrentInventarioPT(inventarioPT);
    setFormData({
      id_produccion: inventarioPT.id_produccion,
      id_venta: inventarioPT.id_venta,
      cantidad_disponible: inventarioPT.cantidad_disponible
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Inventario Producto Terminado Management</h2>
      <form onSubmit={addInventarioPT} className="s-form">
        <select name="id_produccion" value={formData.id_produccion} onChange={handleInputChange}>
          <option value="">Selecciona una Producción</option>
          {producciones.map(produccion => (
            <option key={produccion.id_produccion} value={produccion.id_produccion}>{produccion.id_produccion}</option>
          ))}
        </select>
        <br/>
        <br/>
        <select name="id_venta" value={formData.id_venta} onChange={handleInputChange}>
          <option value="">Selecciona una Venta</option>
          {ventas.map(venta => (
            <option key={venta.id_venta} value={venta.id_venta}>{venta.id_venta}</option>
          ))}
        </select>
        <br/>
        <br/>
        <input type="text" name="cantidad_disponible" placeholder="Cantidad Disponible" value={formData.cantidad_disponible} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Inventario Producto Terminado" : "Agregar Inventario Producto Terminado"}</button> 
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
      <Link to="/"> 
          <br/>
          <button>Volver a la página principal</button>
        </Link>
    </div>
  );
};

export default InventarioPTComponent;
