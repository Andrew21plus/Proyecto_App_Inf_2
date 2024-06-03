const { Sequelize } = require('sequelize');
const fs = require('fs');

// Leer configuración del archivo JSON
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const dbConfig = config.database;

let sequelize;

if (dbConfig.type === "mysql") {
    sequelize = new Sequelize(dbConfig.mysql.database, dbConfig.mysql.user, dbConfig.mysql.password, {
        host: dbConfig.mysql.host,
        dialect: 'mysql'
    });
} else if (dbConfig.type === "postgres") {
    sequelize = new Sequelize(dbConfig.postgres.database, dbConfig.postgres.user, dbConfig.postgres.password, {
        host: dbConfig.postgres.host,
        dialect: 'postgres'
    });
} else {
    throw new Error("Tipo de base de datos no compatible");
}

module.exports = sequelize;