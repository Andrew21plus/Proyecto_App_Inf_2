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

export const validateInventarioMPFormData = (formData) => {
  const errors = {};
  if (!formData.nombre) {
    errors.nombre = 'Nombre es requerido';
  }
  if (!formData.descripcion) {
    errors.descripcion = 'Descripción es requerida';
  }
  if (!formData.proveedor) {
    errors.proveedor = 'Proveedor es requerido';
  }
  if (!formData.cantidad_ingreso) {
    errors.cantidad_ingreso = 'Cantidad de ingreso es requerida';
  }
  if (!formData.cantidad_disponible) {
    errors.cantidad_disponible = 'Cantidad disponible es requerida';
  }
  return errors;
};
