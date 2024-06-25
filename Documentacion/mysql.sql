-- Eliminar tablas si existen
DROP TABLE IF EXISTS etapa CASCADE;
DROP TABLE IF EXISTS inconveniente CASCADE;
DROP TABLE IF EXISTS inventario_materia_prima CASCADE;
DROP TABLE IF EXISTS inventario_producto_terminado CASCADE;
DROP TABLE IF EXISTS produccion CASCADE;
DROP TABLE IF EXISTS produccion_etapa CASCADE;
DROP TABLE IF EXISTS rol CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS usuario_materia_prima CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;

-- ==============================================================
-- Table: ETAPA
-- ==============================================================
CREATE TABLE etapa 
(
   id_etapa             INTEGER AUTO_INCREMENT PRIMARY KEY,
   etapa                TEXT                           NULL,
   descripcion          TEXT                           NULL
);

-- ==============================================================
-- Table: INCONVENIENTE
-- ==============================================================
CREATE TABLE inconveniente 
(
   id_inconveniente     INTEGER AUTO_INCREMENT PRIMARY KEY,
   id_produccion        INTEGER                        NULL,
   descripcion          TEXT                           NULL
);

-- ==============================================================
-- Table: INVENTARIO_MATERIA_PRIMA
-- ==============================================================
CREATE TABLE inventario_materia_prima 
(
   id_materia_prima     INTEGER AUTO_INCREMENT PRIMARY KEY,
   nombre               TEXT                           NULL,
   descripcion          TEXT                           NULL,
   proveedor            TEXT                           NULL,
   cantidad_ingreso     INTEGER                        NULL,
   cantidad_disponible  INTEGER                        NULL
);

-- ==============================================================
-- Table: INVENTARIO_PRODUCTO_TERMINADO
-- ==============================================================
CREATE TABLE inventario_producto_terminado 
(
   id_producto          INTEGER AUTO_INCREMENT PRIMARY KEY,
   id_produccion        INTEGER                        NULL,
   id_venta             INTEGER                        NULL,
   cantidad_disponible  INTEGER                        NULL
);

-- ==============================================================
-- Table: PRODUCCION
-- ==============================================================
CREATE TABLE produccion 
(
   id_produccion        INTEGER AUTO_INCREMENT PRIMARY KEY,
   id_materia_prima     INTEGER                        NULL,
   fecha                DATE                           NULL,
   cantidad_uso         INTEGER                        NULL,
   descripcion          TEXT                           NULL
);

-- ==============================================================
-- Table: PRODUCCION_ETAPA
-- ==============================================================
CREATE TABLE produccion_etapa 
(
   id_produccion        INTEGER                        NOT NULL,
   id_etapa             INTEGER                        NOT NULL,
   hora_inicio          TIME                           NULL,
   hora_fin             TIME                           NULL,
   estado               TEXT                           NULL,
   PRIMARY KEY (id_produccion, id_etapa)
);

-- ==============================================================
-- Table: ROL
-- ==============================================================
CREATE TABLE rol 
(
   id_rol               INTEGER AUTO_INCREMENT PRIMARY KEY,
   nombre_rol           TEXT                           NULL,
   descripcion          TEXT                           NULL
);

-- ==============================================================
-- Table: USUARIO
-- ==============================================================
CREATE TABLE usuario 
(
   id_usuario           INTEGER AUTO_INCREMENT PRIMARY KEY,
   id_rol               INTEGER                        NULL,
   cedula               TEXT                           NULL,
   nombre_usuario       TEXT                           NULL,
   apellido_usuario     TEXT                           NULL,
   email                TEXT                           NULL,
   contrasena           TEXT                           NULL,
   telefono             NUMERIC                        NULL
);

-- ==============================================================
-- Table: USUARIO_MATERIA_PRIMA
-- ==============================================================
CREATE TABLE usuario_materia_prima 
(
   id_usuario           INTEGER                        NOT NULL,
   id_materia_prima     INTEGER                        NOT NULL,
   fecha_ingreso        DATE                           NULL,
   cantidad_nuevo_ingreso INTEGER                      NULL,
   PRIMARY KEY (id_usuario, id_materia_prima)
);

-- ==============================================================
-- Table: VENTAS
-- ==============================================================
CREATE TABLE ventas 
(
   id_venta             INTEGER AUTO_INCREMENT PRIMARY KEY,
   id_usuario           INTEGER                        NULL,
   descripcion          TEXT                           NULL,
   cantidad             INTEGER                        NULL
);

ALTER TABLE inconveniente
   ADD CONSTRAINT fk_inconven_reference_producci FOREIGN KEY (id_produccion)
      REFERENCES produccion (id_produccion)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE inventario_producto_terminado
   ADD CONSTRAINT fk_inventar_reference_ventas FOREIGN KEY (id_venta)
      REFERENCES ventas (id_venta)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE inventario_producto_terminado
   ADD CONSTRAINT fk_inventar_reference_producci FOREIGN KEY (id_produccion)
      REFERENCES produccion (id_produccion)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE produccion
   ADD CONSTRAINT fk_producci_reference_inventar FOREIGN KEY (id_materia_prima)
      REFERENCES inventario_materia_prima (id_materia_prima)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE produccion_etapa
   ADD CONSTRAINT fk_producci_reference_producci FOREIGN KEY (id_produccion)
      REFERENCES produccion (id_produccion)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE produccion_etapa
   ADD CONSTRAINT fk_producci_reference_etapa FOREIGN KEY (id_etapa)
      REFERENCES etapa (id_etapa)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE usuario
   ADD CONSTRAINT fk_usuario_reference_rol FOREIGN KEY (id_rol)
      REFERENCES rol (id_rol)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE usuario_materia_prima
   ADD CONSTRAINT fk_usuario__reference_usuario FOREIGN KEY (id_usuario)
      REFERENCES usuario (id_usuario)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE usuario_materia_prima
   ADD CONSTRAINT fk_usuario__reference_inventar FOREIGN KEY (id_materia_prima)
      REFERENCES inventario_materia_prima (id_materia_prima)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE ventas
   ADD CONSTRAINT fk_ventas_reference_usuario FOREIGN KEY (id_usuario)
      REFERENCES usuario (id_usuario)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;
