-- Eliminar tablas si existen
DROP TABLE IF EXISTS ETAPA CASCADE;
DROP TABLE IF EXISTS INCONVENIENTE CASCADE;
DROP TABLE IF EXISTS INVENTARIO_MATERIA_PRIMA CASCADE;
DROP TABLE IF EXISTS INVENTARIO_PRODUCTO_TERMINADO CASCADE;
DROP TABLE IF EXISTS PRODUCCION CASCADE;
DROP TABLE IF EXISTS PRODUCCION_ETAPA CASCADE;
DROP TABLE IF EXISTS ROL CASCADE;
DROP TABLE IF EXISTS USUARIO CASCADE;
DROP TABLE IF EXISTS USUARIO_MATERIA_PRIMA CASCADE;
DROP TABLE IF EXISTS VENTAS CASCADE;

-- ==============================================================
-- Table: ETAPA
-- ==============================================================
CREATE TABLE ETAPA 
(
   ID_ETAPA             INTEGER AUTO_INCREMENT PRIMARY KEY,
   ETAPA                TEXT                           NULL,
   DESCRIPCION          TEXT                           NULL
);

-- ==============================================================
-- Table: INCONVENIENTE
-- ==============================================================
CREATE TABLE INCONVENIENTE 
(
   ID_INCONVENIENTE     INTEGER AUTO_INCREMENT PRIMARY KEY,
   ID_PRODUCCION        INTEGER                        NULL,
   DESCRIPCION          TEXT                           NULL
);

-- ==============================================================
-- Table: INVENTARIO_MATERIA_PRIMA
-- ==============================================================
CREATE TABLE INVENTARIO_MATERIA_PRIMA 
(
   ID_MATERIA_PRIMA     INTEGER AUTO_INCREMENT PRIMARY KEY,
   NOMBRE               TEXT                           NULL,
   DESCRIPCION          TEXT                           NULL,
   PROVEEDOR            TEXT                           NULL,
   CANTIDAD_INGRESO     INTEGER                        NULL,
   CANTIDAD_DISPONIBLE  INTEGER                        NULL
);

-- ==============================================================
-- Table: INVENTARIO_PRODUCTO_TERMINADO
-- ==============================================================
CREATE TABLE INVENTARIO_PRODUCTO_TERMINADO 
(
   ID_PRODUCTO          INTEGER AUTO_INCREMENT PRIMARY KEY,
   ID_PRODUCCION        INTEGER                        NULL,
   ID_VENTA             INTEGER                        NULL,
   CANTIDAD_DISPONIBLE  INTEGER                        NULL
);

-- ==============================================================
-- Table: PRODUCCION
-- ==============================================================
CREATE TABLE PRODUCCION 
(
   ID_PRODUCCION        INTEGER AUTO_INCREMENT PRIMARY KEY,
   ID_MATERIA_PRIMA     INTEGER                        NULL,
   FECHA                DATE                           NULL,
   CANTIDAD_USO         INTEGER                        NULL,
   DESCRIPCION          TEXT                           NULL
);

-- ==============================================================
-- Table: PRODUCCION_ETAPA
-- ==============================================================
CREATE TABLE PRODUCCION_ETAPA 
(
   ID_PRODUCCION        INTEGER                        NOT NULL,
   ID_ETAPA             INTEGER                        NOT NULL,
   HORA_INICIO          TIME                           NULL,
   HORA_FIN             TIME                           NULL,
   ESTADO               TEXT                           NULL,
   PRIMARY KEY (ID_PRODUCCION, ID_ETAPA)
);

-- ==============================================================
-- Table: ROL
-- ==============================================================
CREATE TABLE ROL 
(
   ID_ROL               INTEGER AUTO_INCREMENT PRIMARY KEY,
   NOMBRE_ROL           TEXT                           NULL,
   DESCRIPCION          TEXT                           NULL
);

-- ==============================================================
-- Table: USUARIO
-- ==============================================================
CREATE TABLE USUARIO 
(
   ID_USUARIO           INTEGER AUTO_INCREMENT PRIMARY KEY,
   ID_ROL               INTEGER                        NULL,
   CEDULA               TEXT                           NULL,
   NOMBRE_USUARIO       TEXT                           NULL,
   APELLIDO_USUARIO     TEXT                           NULL,
   EMAIL                TEXT                           NULL,
   CONTRASENA           TEXT                           NULL,
   TELEFONO             NUMERIC                        NULL
);

-- ==============================================================
-- Table: USUARIO_MATERIA_PRIMA
-- ==============================================================
CREATE TABLE USUARIO_MATERIA_PRIMA 
(
   ID_USUARIO           INTEGER                        NOT NULL,
   ID_MATERIA_PRIMA     INTEGER                        NOT NULL,
   FECHA_INGRESO        DATE                           NULL,
   CANTIDAD_NUEVO_INGRESO INTEGER                      NULL,
   PRIMARY KEY (ID_USUARIO, ID_MATERIA_PRIMA)
);

-- ==============================================================
-- Table: VENTAS
-- ==============================================================
CREATE TABLE VENTAS 
(
   ID_VENTA             INTEGER AUTO_INCREMENT PRIMARY KEY,
   ID_USUARIO           INTEGER                        NULL,
   DESCRIPCION          TEXT                           NULL,
   CANTIDAD             INTEGER                        NULL
);

ALTER TABLE INCONVENIENTE
   ADD CONSTRAINT FK_INCONVEN_REFERENCE_PRODUCCI FOREIGN KEY (ID_PRODUCCION)
      REFERENCES PRODUCCION (ID_PRODUCCION)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE INVENTARIO_PRODUCTO_TERMINADO
   ADD CONSTRAINT FK_INVENTAR_REFERENCE_VENTAS FOREIGN KEY (ID_VENTA)
      REFERENCES VENTAS (ID_VENTA)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE INVENTARIO_PRODUCTO_TERMINADO
   ADD CONSTRAINT FK_INVENTAR_REFERENCE_PRODUCCI FOREIGN KEY (ID_PRODUCCION)
      REFERENCES PRODUCCION (ID_PRODUCCION)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE PRODUCCION
   ADD CONSTRAINT FK_PRODUCCI_REFERENCE_INVENTAR FOREIGN KEY (ID_MATERIA_PRIMA)
      REFERENCES INVENTARIO_MATERIA_PRIMA (ID_MATERIA_PRIMA)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE PRODUCCION_ETAPA
   ADD CONSTRAINT FK_PRODUCCI_REFERENCE_PRODUCCI FOREIGN KEY (ID_PRODUCCION)
      REFERENCES PRODUCCION (ID_PRODUCCION)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE PRODUCCION_ETAPA
   ADD CONSTRAINT FK_PRODUCCI_REFERENCE_ETAPA FOREIGN KEY (ID_ETAPA)
      REFERENCES ETAPA (ID_ETAPA)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE USUARIO
   ADD CONSTRAINT FK_USUARIO_REFERENCE_ROL FOREIGN KEY (ID_ROL)
      REFERENCES ROL (ID_ROL)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE USUARIO_MATERIA_PRIMA
   ADD CONSTRAINT FK_USUARIO__REFERENCE_USUARIO FOREIGN KEY (ID_USUARIO)
      REFERENCES USUARIO (ID_USUARIO)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE USUARIO_MATERIA_PRIMA
   ADD CONSTRAINT FK_USUARIO__REFERENCE_INVENTAR FOREIGN KEY (ID_MATERIA_PRIMA)
      REFERENCES INVENTARIO_MATERIA_PRIMA (ID_MATERIA_PRIMA)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;

ALTER TABLE VENTAS
   ADD CONSTRAINT FK_VENTAS_REFERENCE_USUARIO FOREIGN KEY (ID_USUARIO)
      REFERENCES USUARIO (ID_USUARIO)
      ON UPDATE RESTRICT
      ON DELETE CASCADE;
