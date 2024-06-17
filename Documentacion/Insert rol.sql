--Roles
INSERT INTO public.rol(
	 nombre_rol, descripcion)
	VALUES ( 'Administrador', 'Encargado del Sistema');

INSERT INTO public.rol(
	 nombre_rol, descripcion)
	VALUES ( 'Gerente', 'Encargado del Negocio');

INSERT INTO public.rol(
	 nombre_rol, descripcion)
	VALUES ( 'Jefe de Planta', 'Encargado de Operaciones de Producción');
--Usuario Admin
INSERT INTO public.usuario(
	 id_rol, cedula, nombre_usuario, apellido_usuario, email, contrasena, telefono)
	VALUES (1, '999999999-9', 'Admin', 'Admin', 'Admin@admin.com', 'Admin1234.', '9999999999');

INSERT INTO public.usuario(
	 id_rol, cedula, nombre_usuario, apellido_usuario, email, contrasena, telefono)
	VALUES (2, '1804393419', 'Andres', 'Lagos', 'andres.lagos@espoch.edu.ec', 'Andres21plus.', '0960517044');