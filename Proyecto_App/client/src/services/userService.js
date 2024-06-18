const API_URL = 'http://localhost:3307/usuarios';

// Validación de cédula ecuatoriana
const validateCedula = (cedula) => {
  if (cedula.length !== 10) return false;

  const digits = cedula.split('').map(Number);
  const provinceCode = parseInt(cedula.substring(0, 2));
  if (provinceCode < 1 || provinceCode > 24) return false;

  const lastDigit = digits.pop();
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    if (i % 2 === 0) {
      const double = digits[i] * 2;
      sum += double > 9 ? double - 9 : double;
    } else {
      sum += digits[i];
    }
  }

  const calculatedLastDigit = 10 - (sum % 10);
  return calculatedLastDigit === lastDigit;
};

const validateFormData = (formData) => {
  let formErrors = {};

  if (!formData.id_rol) formErrors.id_rol = "El rol es requerido";
  if (!formData.cedula) {
    formErrors.cedula = "La cédula es requerida";
  } else if (!validateCedula(formData.cedula)) {
    formErrors.cedula = "La cédula no es válida";
  }
  if (!formData.nombre_usuario) formErrors.nombre_usuario = "El nombre es requerido";
  if (!formData.apellido_usuario) formErrors.apellido_usuario = "El apellido es requerido";
  if (!formData.email) {
    formErrors.email = "El email es requerido";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    formErrors.email = "El email no es válido";
  }
  if (!formData.contrasena) formErrors.contrasena = "La contraseña es requerida";
  if (!formData.telefono) {
    formErrors.telefono = "El teléfono es requerido";
  } else if (!/^\d{10}$/.test(formData.telefono)) {
    formErrors.telefono = "El teléfono debe tener 10 dígitos";
  }

  return formErrors;
};

export const fetchUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createUser = async (userData) => {
  const errors = validateFormData(userData);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateUser = async (id, userData) => {
  const errors = validateFormData(userData);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text(); // Maneja respuesta como texto
};

