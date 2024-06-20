// services/produccionService.js

export const validateProduccionFormData = (data) => {
    const errors = {};
    if (!data.id_materia_prima) errors.id_materia_prima = "Materia Prima es requerida";
    if (!data.fecha) errors.fecha = "Fecha es requerida";
    if (!data.cantidad_uso) {
      errors.cantidad_uso = "Cantidad de Uso es requerida";
    } else if (isNaN(data.cantidad_uso)) {
      errors.cantidad_uso = "Cantidad de Uso debe ser un número";
    }
    if (!data.descripcion) errors.descripcion = "Descripción es requerida";
    return errors;
  };
  