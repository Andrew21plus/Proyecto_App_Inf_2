// services/stageService.js

export const validateStageFormData = (data) => {
    const errors = {};
    if (!data.etapa) errors.etapa = "Etapa es requerida";
    if (!data.descripcion) errors.descripcion = "Descripción es requerida";
    return errors;
  };
  