-- Eliminar la restricción existente
ALTER TABLE usuario DROP CONSTRAINT fk_usuario_rol;

-- Agregar la nueva restricción con ON DELETE SET NULL
ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_rol
FOREIGN KEY (id_rol)
REFERENCES rol (id_rol)
ON DELETE SET NULL
ON UPDATE RESTRICT;

-- Eliminar la restricción existente
ALTER TABLE ventas DROP CONSTRAINT fk_ventas_usuario;

-- Agregar la nueva restricción con ON DELETE SET NULL
ALTER TABLE ventas
ADD CONSTRAINT fk_ventas_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario)
ON DELETE SET NULL
ON UPDATE RESTRICT;

-- Eliminar la restricción existente
ALTER TABLE usuario_materia_prima DROP CONSTRAINT fk_usuario_materia_prima_usuario;

-- Agregar la nueva restricción con ON DELETE SET NULL
ALTER TABLE usuario_materia_prima
ADD CONSTRAINT fk_usuario_materia_prima_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario)
ON DELETE SET NULL
ON UPDATE RESTRICT;

ALTER TABLE usuario_materia_prima
ALTER COLUMN id_usuario DROP NOT NULL;
