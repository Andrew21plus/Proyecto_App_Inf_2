const API_URL = 'http://localhost:3307/produccion-etapa';

const validateFormData = (formData) => {
  let formErrors = {};

  if (!formData.id_produccion) formErrors.id_produccion = "La producción es requerida";
  if (!formData.id_etapa) formErrors.id_etapa = "La etapa es requerida";
  if (!formData.hora_inicio) formErrors.hora_inicio = "La hora de inicio es requerida";
  if (!formData.hora_fin) formErrors.hora_fin = "La hora de fin es requerida";
  if (!formData.estado) formErrors.estado = "El estado es requerido";

  return formErrors;
};

export const validateProductionStageFormData = validateFormData;

export const fetchProductionStages = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createProductionStage = async (stageData) => {
  const errors = validateFormData(stageData);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(stageData)
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateProductionStage = async (id, stageData) => {
  const errors = validateFormData(stageData);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(stageData)
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteProductionStage = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
