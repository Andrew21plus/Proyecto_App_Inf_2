const API_URL = 'http://localhost:3307/ventas';

const validateFormData = (formData) => {
  let formErrors = {};

  if (!formData.id_usuario) formErrors.id_usuario = "El usuario es requerido";
  if (!formData.id_producto) formErrors.id_producto = "El producto es requerido";
  if (!formData.descripcion) formErrors.descripcion = "La descripción es requerida";
  if (!formData.cantidad) {
    formErrors.cantidad = "La cantidad es requerida";
  } else if (isNaN(formData.cantidad) || parseInt(formData.cantidad) <= 0) {
    formErrors.cantidad = "La cantidad debe ser un número positivo";
  }

  return formErrors;
};

export const validateSalesFormData = validateFormData;

export const fetchSales = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createSale = async (saleData) => {
  const errors = validateFormData(saleData);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saleData)
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateSale = async (id, saleData) => {
  const errors = validateFormData(saleData);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saleData)
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteSale = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text(); // Handle response as text
};
