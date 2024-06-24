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
  if (!formData.id_materia_prima) {
    errors.id_materia_prima = 'ID de materia prima es requerido';
  }
  if (!formData.cantidad_nuevo_ingreso) {
    errors.cantidad_nuevo_ingreso = 'Cantidad nuevo ingreso es requerida';
  }
  return errors;
};


