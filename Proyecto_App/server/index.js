const express = require("express");
const app = express();
const mysql = require("mysql");
const cors =require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "app_inf_2"
});

app.post("/create",(req,res)=>{
    const nombre = (req.body.nombre);    
    const descripcion = (req.body.descripcion);
    
    db.query('INSERT INTO rol(nombre_rol,descripcion) VALUES(?,?)',[nombre,descripcion],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("Rol Registrado con Exito!!");
        }
    }
    );
});

app.listen(3307,()=>{
    console.log("Corriendo en el puerto 3307")
})