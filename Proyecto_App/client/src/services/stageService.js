// services/stageService.js

export const validateStageFormData = (data) => {
  const errors = {};
  if (!data.etapa) {
    errors.etapa = "Etapa es requerida";
  } else if (/^\d+$/.test(data.etapa)) {
    errors.etapa = "El nombre de la etapa no puede ser solo números";
  }
  if (!data.descripcion) {
    errors.descripcion = "Descripción es requerida";
  }
  return errors;
};
