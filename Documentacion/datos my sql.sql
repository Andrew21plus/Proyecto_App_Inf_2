INSERT INTO rol ( nombre_rol, descripcion) VALUES
( 'Administrador', 'Encargado del Sistema'),
( 'Gerente', 'Encargado del Negocio'),
('Jefe de Planta', 'Encargado de Operaciones de Producción');

-- Insertar los datos en la tabla 'usuario'
INSERT INTO usuario ( id_rol, cedula, nombre_usuario, apellido_usuario, email, contrasena, telefono) VALUES
( 1, '999999999-9', 'Admin', 'Admin', 'Admin@admin.com', 'Admin1234.', '9999999999'),
( 2, '1804393419', 'Andrés', 'Lagos', 'andres.lagos@espoch.edu.ec', 'Andres21plus.', '960517044');

-- Insertar los datos en la tabla 'inventario_materia_prima'
INSERT INTO inventario_materia_prima (nombre, descripcion, proveedor, cantidad_ingreso, cantidad_disponible) VALUES
( 'Papas', 'Materia Prima Productos Papas', 'Juan Perez', 50, 50);
