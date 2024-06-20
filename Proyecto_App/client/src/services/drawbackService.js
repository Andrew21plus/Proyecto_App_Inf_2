// services/inconvenienteService.js

export const validateInconvenienteFormData = (data) => {
    const errors = {};
    if (!data.id_produccion) errors.id_produccion = "Producción es requerida";
    if (!data.descripcion) errors.descripcion = "Descripción es requerida";
    return errors;
  };
  