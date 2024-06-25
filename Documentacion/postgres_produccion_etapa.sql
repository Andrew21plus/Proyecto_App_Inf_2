-- Eliminar la clave primaria existente
ALTER TABLE produccion_etapa DROP CONSTRAINT PK_PRODUCCION_ETAPA;

-- Agregar una nueva columna 'id' como clave primaria
ALTER TABLE produccion_etapa ADD COLUMN id SERIAL PRIMARY KEY;

-- (Opcional) Asegurar que las columnas id_produccion e id_etapa siguen siendo claves foráneas
-- Si ya existen como claves foráneas, estos comandos no son necesarios
ALTER TABLE produccion_etapa ADD CONSTRAINT FK_PRODUCCION_REFERENCE_PRODUCCION FOREIGN KEY (id_produccion) REFERENCES produccion (id_produccion) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE produccion_etapa ADD CONSTRAINT FK_ETAPA_REFERENCE_ETAPA FOREIGN KEY (id_etapa) REFERENCES etapa (id_etapa) ON UPDATE RESTRICT ON DELETE CASCADE;
