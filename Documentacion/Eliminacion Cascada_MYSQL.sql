-- Modificar la columna id_usuario para permitir NULL
ALTER TABLE usuario_materia_prima MODIFY id_usuario INT NULL;

-- Agregar la nueva restricción de clave foránea
ALTER TABLE usuario_materia_prima
ADD CONSTRAINT fk_usuario_materia_prima_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario)
ON DELETE SET NULL
ON UPDATE RESTRICT;