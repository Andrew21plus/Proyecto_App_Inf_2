import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../utils/Styles.css'; 

const UsuarioMPComponent = () => {
  const [formData, setFormData] = useState({
    id_usuario: '',
    id_materia_prima: '',
    fecha_ingreso: '',
    cantidad_nuevo_ingreso: ''
  });
  const [usuarios, setUsuarios] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [usuariosMateriaPrima, setUsuariosMateriaPrima] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentUsuarioMP, setCurrentUsuarioMP] = useState(null);

  useEffect(() => {
    getUsuarios();
    getMateriasPrimas();
    getUsuariosMateriaPrima();
  }, []);

  const getUsuarios = () => {
    Axios.get("http://localhost:3307/usuarios")
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios:', error);
      });
  };

  const getMateriasPrimas = () => {
    Axios.get("http://localhost:3307/inventario-materia-prima")
      .then(response => {
        setMateriasPrimas(response.data);
      })
      .catch(error => {
        console.error('Error fetching inventario-materia-prima:', error);
      });
  };

  const getUsuariosMateriaPrima = () => {
    Axios.get("http://localhost:3307/usuario-materia-prima")
      .then(response => {
        setUsuariosMateriaPrima(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuario-materia-prima:', error);
      });
  };

  const addUsuarioMP = (e) => {
    e.preventDefault();
    if (editing) {
      Axios.put(`http://localhost:3307/usuario-materia-prima/${currentUsuarioMP.id_usuario}/${currentUsuarioMP.id_materia_prima}`, formData)
        .then(() => {
          alert("Usuario Materia Prima Actualizado");
          setFormData({
            id_usuario: '',
            id_materia_prima: '',
            fecha_ingreso: '',
            cantidad_nuevo_ingreso: ''
          });
          setEditing(false);
          setCurrentUsuarioMP(null);
          getUsuariosMateriaPrima();
        })
        .catch(error => {
          console.error('Error actualizando usuario-materia-prima:', error);
        });
    } else {
      Axios.post("http://localhost:3307/usuario-materia-prima", formData)
        .then(() => {
          alert("Usuario Materia Prima Registrado");
          setFormData({
            id_usuario: '',
            id_materia_prima: '',
            fecha_ingreso: '',
            cantidad_nuevo_ingreso: ''
          });
          getUsuariosMateriaPrima();
          updateInventarioMateriaPrima(formData.id_materia_prima, formData.cantidad_nuevo_ingreso);
        })
        .catch(error => {
          console.error('Error registrando usuario-materia-prima:', error);
        });
    }
  };

  const updateInventarioMateriaPrima = (id_materia_prima, cantidad_nuevo_ingreso) => {
    Axios.put(`http://localhost:3307/inventario-materia-prima/${id_materia_prima}`, { cantidad_nuevo_ingreso })
      .then(() => {
        console.log("Inventario Materia Prima Actualizado");
        getMateriasPrimas(); // actualizar la lista de materias primas
      })
      .catch(error => {
        console.error('Error actualizando inventario-materia-prima:', error);
      });
  };

  const deleteUsuarioMP = (idUsuario, idMateriaPrima) => {
    Axios.delete(`http://localhost:3307/usuario-materia-prima/${idUsuario}/${idMateriaPrima}`)
      .then(() => {
        alert("Usuario Materia Prima Eliminado");
        getUsuariosMateriaPrima();
      })
      .catch(error => {
        console.error('Error eliminando usuario-materia-prima:', error);
      });
  };

  const editUsuarioMP = (usuarioMP) => {
    setEditing(true);
    setCurrentUsuarioMP(usuarioMP);
    setFormData({
      id_usuario: usuarioMP.id_usuario,
      id_materia_prima: usuarioMP.id_materia_prima,
      fecha_ingreso: usuarioMP.fecha_ingreso,
      cantidad_nuevo_ingreso: usuarioMP.cantidad_nuevo_ingreso
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Usuario Materia Prima Management</h2>
      <form onSubmit={addUsuarioMP} className="s-form">
        <select name="id_usuario" value={formData.id_usuario} onChange={handleInputChange}>
          <option value="">Selecciona un Usuario</option>
          {usuarios.map(usuario => (
            <option key={usuario.id_usuario} value={usuario.id_usuario}>{usuario.nombre_usuario}</option>
          ))}
        </select>
        <br/>
        <br/>
        <select name="id_materia_prima" value={formData.id_materia_prima} onChange={handleInputChange}>
          <option value="">Selecciona una Materia Prima</option>
          {materiasPrimas.map(materiaPrima => (
            <option key={materiaPrima.id_materia_prima} value={materiaPrima.id_materia_prima}>{materiaPrima.nombre}</option>
          ))}
        </select>
        <br/>
        <br/>
        <input type="date" name="fecha_ingreso" placeholder="Fecha de Ingreso" value={formData.fecha_ingreso} onChange={handleInputChange} />
        <input type="number" name="cantidad_nuevo_ingreso" placeholder="Cantidad Nuevo Ingreso" value={formData.cantidad_nuevo_ingreso} onChange={handleInputChange} />
        <br/>
        <button type="submit">{editing ? "Actualizar Usuario Materia Prima" : "Agregar Usuario Materia Prima"}</button> 
      </form>
      <h2>Lista de Usuarios Materia Prima</h2>
      <table className="s-table">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>ID Materia Prima</th>
            <th>Fecha de Ingreso</th>
            <th>Cantidad Nuevo Ingreso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosMateriaPrima.map(usuarioMP => (
            <tr key={`${usuarioMP.id_usuario}-${usuarioMP.id_materia_prima}`}>
              <td>{usuarioMP.id_usuario}</td>
              <td>{usuarioMP.id_materia_prima}</td>
              <td>{usuarioMP.fecha_ingreso}</td>
              <td>{usuarioMP.cantidad_nuevo_ingreso}</td>
              <td>
                <button onClick={() => editUsuarioMP(usuarioMP)}>Editar</button>
                <button onClick={() => deleteUsuarioMP(usuarioMP.id_usuario, usuarioMP.id_materia_prima)}>Eliminar</button>
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

export default UsuarioMPComponent;
