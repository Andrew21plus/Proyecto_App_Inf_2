import './App.css';
import {useState} from "react";
import Axios from "axios";


function App() {

  const [nombre,setNombre] = useState(null);
  const [descripcion,setDescripcion] = useState(null);
  
  const addRol =()=>{
    Axios.post("http://localhost:3307/create",{
      nombre:nombre,
      descripcion:descripcion
    }).then(()=>{
      alert("Rol Registrado");
    });
  }

  return (
    <div className="App">
      <div className="datos">
        <label>Nombre: <input onChange={(e)=>{
          setNombre(e.target.value);
        }}type="text"></input></label>
        <label>Descripción: <input onChange={(e)=>{
          setDescripcion(e.target.value);
        }}type="text"></input></label>
        <button onClick={addRol}>Registrar</button>
      </div>
    </div>
  );
}

export default App;
