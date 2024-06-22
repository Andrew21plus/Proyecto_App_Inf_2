// productionstageService.js
const API_URL = 'http://localhost:3307/etapas';

const validateFormData = (formData) => {
  let formErrors = {};

  if (!formData.etapa) formErrors.etapa = "La etapa es requerida";
  if (!formData.descripcion) formErrors.descripcion = "La descripción es requerida";

  return formErrors;
};

export const validateProductionStageFormData = validateFormData;

export const fetchStages = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createStage = async (stageData) => {
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

export const updateStage = async (id, stageData) => {
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

export const deleteStage = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text(); // Handle response as text
};
