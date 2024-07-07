import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import '../utils/StylesTotal.css';  // Asumiendo que el archivo CSS se llama StylesPC.css
import { validateInventarioPTFormData, validateInventarioMPFormData, validateUsuarioMateriaPrimaFormData } from '../services/inventoryService';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus,faSave } from '@fortawesome/free-solid-svg-icons';

const InventoryComponent = () => {
  const { user, roles } = useAuth();
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedMPOption, setSelectedMPOption] = useState(null);
  const [formData, setFormData] = useState({
    id_produccion: '',
    cantidad_disponible: '',
    nombre: '',
    descripcion: '',
    proveedor: '',
    cantidad_ingreso: ''
  });
  const [formUsuarioMateriaPrima, setFormUsuarioMateriaPrima] = useState({
    id_usuario: user?.id || '',
    id_materia_prima: '',
    fecha_ingreso: '',
    cantidad_nuevo_ingreso: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [inventarioProductoTerminado, setInventarioProductoTerminado] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [inventarioMateriaPrima, setInventarioMateriaPrima] = useState([]);
  const [usuarioMateriaPrimaData, setUsuarioMateriaPrimaData] = useState([]);
  const [editingPT, setEditingPT] = useState(false);
  const [editingMP, setEditingMP] = useState(false);
  const [currentInventarioPT, setCurrentInventarioPT] = useState(null);
  const [currentInventarioMP, setCurrentInventarioMP] = useState(null);

  useEffect(() => {
    getInventarioProductoTerminado();
    getProducciones();
    getInventarioMateriaPrima();
    getUsuarioMateriaPrimaData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormUsuarioMateriaPrima((prevForm) => ({
        ...prevForm,
        id_usuario: user.id_usuario
      }));
    }
  }, [user]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormUsuarioMateriaPrima((prevForm) => ({
      ...prevForm,
      fecha_ingreso: today
    }));
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

  const getInventarioMateriaPrima = () => {
    Axios.get("http://localhost:3307/inventario-materia-prima")
      .then(response => {
        setInventarioMateriaPrima(response.data);
      })
      .catch(error => {
        console.error('Error fetching inventario_materia_prima:', error);
      });
  };

  const getUsuarioMateriaPrimaData = () => {
    Axios.get("http://localhost:3307/usuario-materia-prima")
      .then(response => {
        setUsuarioMateriaPrimaData(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuario_materia_prima:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleInputChangeUsuarioMateriaPrima = (e) => {
    const { name, value } = e.target;
    setFormUsuarioMateriaPrima({ ...formUsuarioMateriaPrima, [name]: value });
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
            cantidad_disponible: '',
            nombre: ''
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
            cantidad_disponible: '',
            nombre: ''
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

    const errors = validateInventarioMPFormData(formData, inventarioMateriaPrima);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const dataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      proveedor: formData.proveedor,
      cantidad_ingreso: parseInt(formData.cantidad_ingreso, 10),
      cantidad_disponible: parseInt(formData.cantidad_ingreso, 10)
    };

    console.log("Data to send:", dataToSend);

    if (editingMP) {
      Axios.put(`http://localhost:3307/inventario-materia-prima/${currentInventarioMP.id_materia_prima}`, dataToSend)
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
      Axios.post("http://localhost:3307/inventario-materia-prima", dataToSend)
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

  const addUsuarioMateriaPrima = (e) => {
    e.preventDefault();

    const errors = validateUsuarioMateriaPrimaFormData(formUsuarioMateriaPrima);
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join('\n'));
      return;
    }

    const dataToSend = {
      ...formUsuarioMateriaPrima,
      cantidad_nuevo_ingreso: Number(formUsuarioMateriaPrima.cantidad_nuevo_ingreso)
    };

    console.log("Datos a enviar:", dataToSend);

    Axios.post("http://localhost:3307/usuario-materia-prima", dataToSend)
      .then(() => {
        alert("Datos de Usuario Materia Prima Registrados");
        const today = new Date().toISOString().split('T')[0];
        setFormUsuarioMateriaPrima({
          id_usuario: user?.id || '',
          id_materia_prima: '',
          fecha_ingreso: today,
          cantidad_nuevo_ingreso: ''
        });
        getUsuarioMateriaPrimaData();
        updateInventarioMateriaPrimaCantidadDisponible(dataToSend.id_materia_prima, dataToSend.cantidad_nuevo_ingreso);
      })
      .catch(error => {
        console.error('Error registrando datos de usuario materia prima:', error);
      });
  };

  const updateInventarioMateriaPrimaCantidadDisponible = (id_materia_prima, cantidadNuevoIngreso) => {
    Axios.get(`http://localhost:3307/inventario-materia-prima/${id_materia_prima}`)
      .then(response => {
        const materiaPrima = response.data;
        console.log(`Cantidad disponible actual: ${materiaPrima.cantidad_disponible}`);
        console.log(`Cantidad nuevo ingreso: ${cantidadNuevoIngreso}`);

        const nuevaCantidadDisponible = materiaPrima.cantidad_disponible + cantidadNuevoIngreso;

        console.log(`Nueva cantidad disponible (después de la suma): ${nuevaCantidadDisponible}`);

        Axios.put(`http://localhost:3307/inventario-materia-prima/cantidad-disponible/${id_materia_prima}`, { cantidad_disponible: nuevaCantidadDisponible })
          .then(() => {
            console.log(`Valor final guardado en cantidad_disponible: ${nuevaCantidadDisponible}`);
            getInventarioMateriaPrima();
          })
          .catch(error => {
            console.error('Error actualizando inventario de materia prima:', error);
          });
      })
      .catch(error => {
        console.error('Error obteniendo la cantidad disponible de materia prima:', error);
      });
  };

  const handleChangeMPOption = (option) => {
    setSelectedMPOption(option);
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
      cantidad_disponible: inventarioPT.cantidad_disponible,
      nombre: inventarioPT.nombre
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

  const isGerente = roles.some(role => role.nombre_rol === 'Gerente');
  const isJefePlanta = roles.some(role => role.nombre_rol === 'Jefe de Planta');

  return (
    <div>
      <h1>Gestión de Inventario</h1>
      <div className="form-selector">
        {(isGerente || isJefePlanta) && (
          <>
            <button onClick={() => setSelectedForm('PT')}>Inventario Producto Terminado</button>
            <button onClick={() => setSelectedForm('MP')}>Inventario Materia Prima</button>
          </>
        )}
      </div>

      {selectedForm === 'PT' && (
        <div>
          <h2>Inventario Producto Terminado</h2>
          <h3>Lista de Inventario Producto Terminado</h3>
          <table className="s-table">
            <thead>
              <tr>
                <th>ID Producto</th>
                <th>ID Producción</th>
                <th>Cantidad Disponible</th>
                <th>Nombre</th>
                {isGerente && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {inventarioProductoTerminado.map(inventarioPT => (
                <tr key={inventarioPT.id_producto}>
                  <td data-label="ID Producto">{inventarioPT.id_producto}</td>
                  <td data-label="ID Producción">{inventarioPT.id_produccion}</td>
                  <td data-label="Cantidad Disponible">{inventarioPT.cantidad_disponible}</td>
                  <td data-label="Nombre">{inventarioPT.nombre}</td>
                  {isGerente && (
                    <td data-label="Acciones">
                      <button className="edit-button icon-button" onClick={() => editInventarioPT(inventarioPT)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="delete-button icon-button delete-clicked" onClick={() => deleteInventarioPT(inventarioPT.id_producto)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedForm === 'MP' && (
        <div>
          <h2>Inventario Materia Prima</h2>
          <div className="mp-options">
            <button onClick={() => handleChangeMPOption('Registro')}>Registro Materia Prima</button>
            <button onClick={() => handleChangeMPOption('UsuarioMateriaPrima')}>Registro Usuario Materia Prima</button>
          </div>

          {selectedMPOption === 'Registro' && isGerente && (
            <div>
              <form onSubmit={addInventarioMP} className="s-form">
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} className="input-field" />
                {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
                <br />
                <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} className="input-field" />
                {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
                <br />
                <input type="text" name="proveedor" placeholder="Proveedor" value={formData.proveedor} onChange={handleInputChange} className="input-field" />
                {formErrors.proveedor && <span className="error">{formErrors.proveedor}</span>}
                <br />
                <input type="text" name="cantidad_ingreso" placeholder="Cantidad de Ingreso" value={formData.cantidad_ingreso} onChange={handleInputChange} className="input-field" />
                {formErrors.cantidad_ingreso && <span className="error">{formErrors.cantidad_ingreso}</span>}
                <br />
                <input type="text" name="cantidad_disponible" placeholder="Cantidad Disponible" value={formData.cantidad_disponible} onChange={handleInputChange} disabled className="input-field" />
                {formErrors.cantidad_disponible && <span className="error">{formErrors.cantidad_disponible}</span>}
                <br />
                <button type="submit" className="submit-button icon-button">
                  {editingMP ? <><FontAwesomeIcon icon={faSave} /> Actualizar</> : <><FontAwesomeIcon icon={faPlus} /> Agregar</>}
                </button>
              </form>
              <h3>Lista de Inventario Materia Prima</h3>
              <table className="s-table">
                <thead>
                  <tr>
                    <th>ID Materia Prima</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Proveedor</th>
                    <th>Cantidad de Ingreso</th>
                    <th>Cantidad Disponible</th>
                    {isGerente && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {inventarioMateriaPrima.map(inventarioMP => (
                    <tr key={inventarioMP.id_materia_prima}>
                      <td data-label="ID Materia Prima">{inventarioMP.id_materia_prima}</td>
                      <td data-label="Nombre">{inventarioMP.nombre}</td>
                      <td data-label="Descripción">{inventarioMP.descripcion}</td>
                      <td data-label="Proveedor">{inventarioMP.proveedor}</td>
                      <td data-label="Cantidad de Ingreso">{inventarioMP.cantidad_ingreso}</td>
                      <td data-label="Cantidad Disponible">{inventarioMP.cantidad_disponible}</td>
                      {isGerente && (
                        <td data-label="Acciones">
                          <button className="edit-button icon-button" onClick={() => editInventarioMP(inventarioMP)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="delete-button icon-button delete-clicked" onClick={() => deleteInventarioMP(inventarioMP.id_materia_prima)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedMPOption === 'UsuarioMateriaPrima' && (
            <div>
              <h3>Registro Usuario Materia Prima</h3>
              <form onSubmit={addUsuarioMateriaPrima} className="s-form">
                <input type="hidden" name="id_usuario" value={formUsuarioMateriaPrima.id_usuario} />
                <select name="id_materia_prima" value={formUsuarioMateriaPrima.id_materia_prima} onChange={handleInputChangeUsuarioMateriaPrima} className="input-field">
                  <option value="">Seleccione una Materia Prima</option>
                  {inventarioMateriaPrima.map(mp => (
                    <option key={mp.id_materia_prima} value={mp.id_materia_prima}>
                      {mp.nombre}
                    </option>
                  ))}
                </select>
                <br />
                <input type="date" name="fecha_ingreso" placeholder="Fecha de Ingreso" value={formUsuarioMateriaPrima.fecha_ingreso} onChange={handleInputChangeUsuarioMateriaPrima} readOnly className="input-field" />
                <br />
                <input type="text" name="cantidad_nuevo_ingreso" placeholder="Cantidad Nuevo Ingreso" value={formUsuarioMateriaPrima.cantidad_nuevo_ingreso} onChange={handleInputChangeUsuarioMateriaPrima} className="input-field" />
                <br />
                <button type="submit" className="submit-button icon-button">
                  <FontAwesomeIcon icon={faPlus} /> Agregar
                </button>
              </form>
              <h3>Lista de Usuario Materia Prima</h3>
              <table className="s-table">
                <thead>
                  <tr>
                    <th>ID Usuario</th>
                    <th>ID Materia Prima</th>
                    <th>Fecha Ingreso</th>
                    <th>Cantidad Nuevo Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarioMateriaPrimaData.map(ump => (
                    <tr key={`${ump.id_usuario}-${ump.id_materia_prima}-${ump.fecha_ingreso}`}>
                      <td data-label="ID Usuario">{ump.id_usuario}</td>
                      <td data-label="ID Materia Prima">{ump.id_materia_prima}</td>
                      <td data-label="Fecha Ingreso">{ump.fecha_ingreso}</td>
                      <td data-label="Cantidad Nuevo Ingreso">{ump.cantidad_nuevo_ingreso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isJefePlanta && selectedMPOption === 'Registro' && (
            <div>
              <h3>Lista de Inventario Materia Prima</h3>
              <table className="s-table">
                <thead>
                  <tr>
                    <th>ID Materia Prima</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Proveedor</th>
                    <th>Cantidad de Ingreso</th>
                    <th>Cantidad Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {inventarioMateriaPrima.map(inventarioMP => (
                    <tr key={inventarioMP.id_materia_prima}>
                      <td data-label="ID Materia Prima">{inventarioMP.id_materia_prima}</td>
                      <td data-label="Nombre">{inventarioMP.nombre}</td>
                      <td data-label="Descripción">{inventarioMP.descripcion}</td>
                      <td data-label="Proveedor">{inventarioMP.proveedor}</td>
                      <td data-label="Cantidad de Ingreso">{inventarioMP.cantidad_ingreso}</td>
                      <td data-label="Cantidad Disponible">{inventarioMP.cantidad_disponible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryComponent;
