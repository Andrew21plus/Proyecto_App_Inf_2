// productionService.js
export const validateProduccionFormData = (formData) => {
  let errors = {};

  // Validar fecha (si se necesitara alguna validación adicional)
  if (!formData.fecha) {
    errors.fecha = "La fecha es obligatoria.";
  }

  // Validar descripción
  if (!formData.descripcion) {
    errors.descripcion = "La descripción es obligatoria.";
  }

  // Validar cantidad de uso para cada materia prima
  formData.materiasPrimas.forEach((mp, index) => {
    if (!mp.id_materia_prima) {
      errors[`id_materia_prima_${index}`] = "Selecciona una materia prima.";
    }
    if (mp.cantidad_uso <= 0) {
      errors[`cantidad_uso_${index}`] = "La cantidad de uso debe ser mayor que 0.";
    }
  });

  return errors;
};
