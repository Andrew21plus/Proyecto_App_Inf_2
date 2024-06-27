// productionService.js

export const validateProduccionFormData = (data) => {
  const errors = {};
  if (!data.fecha) errors.fecha = "Fecha es requerida";
  if (!data.descripcion) errors.descripcion = "Descripción es requerida";
  
  data.materiasPrimas.forEach((mp, index) => {
    if (!mp.id_materia_prima) {
      errors[`id_materia_prima_${index}`] = "Materia Prima es requerida";
    }
    if (!mp.cantidad_uso) {
      errors[`cantidad_uso_${index}`] = "Cantidad de Uso es requerida";
    } else if (isNaN(mp.cantidad_uso)) {
      errors[`cantidad_uso_${index}`] = "Cantidad de Uso debe ser un número";
    }
  });

  return errors;
};
