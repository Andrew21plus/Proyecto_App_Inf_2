const express = require("express");
const app = express();
const mysql = require("mysql");
const { Client } = require("pg");
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());

// Leer configuración del archivo JSON
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const dbConfig = config.database;
let db;

if (dbConfig.type === "mysql") {
    db = mysql.createConnection(dbConfig.mysql);
} else if (dbConfig.type === "postgres") {
    db = new Client(dbConfig.postgres);
    db.connect();
}

app.post("/create", (req, res) => {
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;

    if (dbConfig.type === "mysql") {
        db.query('INSERT INTO rol(nombre_rol,descripcion) VALUES(?,?)', [nombre, descripcion],
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Rol Registrado con Exito!!");
                }
            }
        );
    } else if (dbConfig.type === "postgres") {
        db.query('INSERT INTO rol(nombre_rol,descripcion) VALUES($1, $2)', [nombre, descripcion],
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Rol Registrado con Exito!!");
                }
            }
        );
    }
});

app.listen(3307, () => {
    console.log("Corriendo en el puerto 3307");
});
