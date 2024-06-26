USE app_inf_2;

DROP TABLE IF EXISTS etapa;
DROP TABLE IF EXISTS inconveniente;
DROP TABLE IF EXISTS inventario_materia_prima;
DROP TABLE IF EXISTS inventario_producto_terminado;
DROP TABLE IF EXISTS produccion;
DROP TABLE IF EXISTS produccion_etapa;
DROP TABLE IF EXISTS produccion_materia_prima;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS usuario_materia_prima;
DROP TABLE IF EXISTS ventas;

-- Table: ETAPA
CREATE TABLE etapa (
    id_etapa INTEGER AUTO_INCREMENT PRIMARY KEY,
    etapa TEXT NULL,
    descripcion TEXT NULL
);

-- Table: INVENTARIO_MATERIA_PRIMA
CREATE TABLE inventario_materia_prima (
    id_materia_prima INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre TEXT NULL,
    descripcion TEXT NULL,
    proveedor TEXT NULL,
    cantidad_ingreso INTEGER NULL,
    cantidad_disponible INTEGER NULL
);

-- Table: PRODUCCION
CREATE TABLE produccion (
    id_produccion INTEGER AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NULL,
    descripcion TEXT NULL
);

-- Table: PRODUCCION_MATERIA_PRIMA (Tabla de unión)
CREATE TABLE produccion_materia_prima (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_produccion INTEGER NOT NULL,
    id_materia_prima INTEGER NOT NULL,
    cantidad_uso INTEGER NULL,
    CONSTRAINT fk_produccion_materia_prima_produccion FOREIGN KEY (id_produccion)
        REFERENCES produccion (id_produccion)
        ON UPDATE RESTRICT
        ON DELETE CASCADE,
    CONSTRAINT fk_produccion_materia_prima_materia_prima FOREIGN KEY (id_materia_prima)
        REFERENCES inventario_materia_prima (id_materia_prima)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

-- Table: PRODUCCION_ETAPA
CREATE TABLE produccion_etapa (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_produccion INTEGER NOT NULL,
    id_etapa INTEGER NOT NULL,
    hora_inicio TIME NULL,
    hora_fin TIME NULL,
    estado TEXT NULL,
    CONSTRAINT fk_produccion_etapa_produccion FOREIGN KEY (id_produccion)
        REFERENCES produccion (id_produccion)
        ON UPDATE RESTRICT
        ON DELETE CASCADE,
    CONSTRAINT fk_produccion_etapa_etapa FOREIGN KEY (id_etapa)
        REFERENCES etapa (id_etapa)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

-- Table: ROL
CREATE TABLE rol (
    id_rol INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre_rol TEXT NULL,
    descripcion TEXT NULL
);

-- Table: USUARIO
CREATE TABLE usuario (
    id_usuario INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_rol INTEGER NULL,
    cedula TEXT NULL,
    nombre_usuario TEXT NULL,
    apellido_usuario TEXT NULL,
    email TEXT NULL,
    contrasena TEXT NULL,
    telefono NUMERIC NULL,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol)
        REFERENCES rol (id_rol)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

-- Table: INCONVENIENTE
CREATE TABLE inconveniente (
    id_inconveniente INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_produccion INTEGER NULL,
    descripcion TEXT NULL,
    CONSTRAINT fk_inconveniente_produccion FOREIGN KEY (id_produccion)
        REFERENCES produccion (id_produccion)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

-- Table: INVENTARIO_PRODUCTO_TERMINADO
CREATE TABLE inventario_producto_terminado (
    id_producto INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_produccion INTEGER NULL,
    cantidad_disponible INTEGER NULL,
    nombre TEXT NULL,
    CONSTRAINT fk_inventario_producto_terminado_produccion FOREIGN KEY (id_produccion)
        REFERENCES produccion (id_produccion)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

-- Table: VENTAS
CREATE TABLE ventas (
    id_venta INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_usuario INTEGER NULL,
    id_producto INTEGER NULL,
    descripcion TEXT NULL,
    cantidad INTEGER NULL,
    CONSTRAINT fk_ventas_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT
        ON DELETE CASCADE,
    CONSTRAINT fk_ventas_producto FOREIGN KEY (id_producto)
        REFERENCES inventario_producto_terminado (id_producto)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

-- Table: USUARIO_MATERIA_PRIMA
CREATE TABLE usuario_materia_prima (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_materia_prima INTEGER NOT NULL,
    fecha_ingreso DATE NULL,
    cantidad_nuevo_ingreso INTEGER NULL,
    CONSTRAINT fk_usuario_materia_prima_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT
        ON DELETE CASCADE,
    CONSTRAINT fk_usuario_materia_prima_materia_prima FOREIGN KEY (id_materia_prima)
        REFERENCES inventario_materia_prima (id_materia_prima)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

