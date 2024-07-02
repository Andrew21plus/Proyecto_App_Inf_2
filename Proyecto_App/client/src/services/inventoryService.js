// inventoryService.js

export const validateInventarioPTFormData = (formData) => {
  const errors = {};
  if (!formData.id_produccion) {
    errors.id_produccion = 'ID de producción es requerido';
  }
  if (!formData.nombre) {
    errors.nombre = 'Nombre es requerido';
  }
  if (!formData.cantidad_disponible) {
    errors.cantidad_disponible = 'Cantidad disponible es requerida';
  }
  return errors;
};

export const validateInventarioMPFormData = (formData, existingMateriasPrimas) => {
  const errors = {};

  if (!formData.nombre) {
    errors.nombre = 'Nombre es requerido';
  } else if (existingMateriasPrimas.some(mp => mp.nombre === formData.nombre)) {
    errors.nombre = 'El nombre ya está registrado';
  }

  if (!formData.descripcion) {
    errors.descripcion = 'Descripción es requerida';
  }

  if (!formData.proveedor) {
    errors.proveedor = 'Proveedor es requerido';
  }

  if (!formData.cantidad_ingreso) {
    errors.cantidad_ingreso = 'Cantidad de ingreso es requerida';
  } else if (formData.cantidad_ingreso <= 0) {
    errors.cantidad_ingreso = 'La cantidad de ingreso debe ser mayor que 0';
  }

  return errors;
};

// inventoryService.js

export const validateUsuarioMateriaPrimaFormData = (formData) => {
  const errors = {};

  if (!formData.id_usuario) {
    errors.id_usuario = 'ID de usuario es requerido';
  }
  if (!formData.id_materia_prima) {
    errors.id_materia_prima = 'ID de materia prima es requerido';
  }
  if (!formData.fecha_ingreso) {
    errors.fecha_ingreso = 'Fecha de ingreso es requerida';
  } else {
    const today = new Date().toISOString().split('T')[0];
    if (formData.fecha_ingreso !== today) {
      errors.fecha_ingreso = 'La fecha de ingreso debe ser la fecha actual';
    }
  }
  if (!formData.cantidad_nuevo_ingreso) {
    errors.cantidad_nuevo_ingreso = 'Cantidad nuevo ingreso es requerida';
  } else if (formData.cantidad_nuevo_ingreso <= 0) {
    errors.cantidad_nuevo_ingreso = 'La cantidad de nuevo ingreso debe ser mayor que 0';
  }

  return errors;
};
