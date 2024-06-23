import { fetchRoles } from './roleService';

const API_URL = 'http://localhost:3307/usuarios';

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

const validateNombreApellido = (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);

const validateContrasena = (contrasena) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(contrasena);
  const hasNumber = /\d/.test(contrasena);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(contrasena);
  return contrasena.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
};

const validateFormData = async (formData) => {
  let formErrors = {};

  const usuarios = await fetchUsers(); // Obtener la lista de usuarios para validaciones
  const roles = await fetchRoles(); // Obtener la lista de roles para validaciones

  if (!formData.id_rol) formErrors.id_rol = "El rol es requerido";
  else {
    // Validar que solo haya un Administrador, Gerente y Jefe de Planta
    const roleLimits = {
      'Administrador': 1,
      'Gerente': 1,
      'Jefe de Planta': 1
    };

    const roleCounts = usuarios.reduce((acc, usuario) => {
      const roleName = roles.find(rol => rol.id_rol === usuario.id_rol)?.nombre_rol;
      if (roleLimits[roleName]) {
        acc[roleName] = (acc[roleName] || 0) + 1;
      }
      return acc;
    }, {});

    const selectedRole = roles.find(rol => rol.id_rol === formData.id_rol)?.nombre_rol;
    if (roleLimits[selectedRole] && roleCounts[selectedRole] >= roleLimits[selectedRole]) {
      formErrors.id_rol = `Solo se permite un usuario con el rol de ${selectedRole}`;
    }
  }

  if (!formData.cedula) {
    formErrors.cedula = "La cédula es requerida";
  } else if (!validateCedula(formData.cedula)) {
    formErrors.cedula = "La cédula no es válida";
  } else if (usuarios.some(usuario => usuario.cedula === formData.cedula && usuario.id_usuario !== formData.id_usuario)) {
    formErrors.cedula = "La cédula ya está registrada";
  }

  if (!formData.nombre_usuario) {
    formErrors.nombre_usuario = "El nombre es requerido";
  } else if (!validateNombreApellido(formData.nombre_usuario)) {
    formErrors.nombre_usuario = "El nombre solo puede contener letras";
  }

  if (!formData.apellido_usuario) {
    formErrors.apellido_usuario = "El apellido es requerido";
  } else if (!validateNombreApellido(formData.apellido_usuario)) {
    formErrors.apellido_usuario = "El apellido solo puede contener letras";
  }

  if (!formData.email) {
    formErrors.email = "El email es requerido";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    formErrors.email = "El email no es válido";
  }

  if (!formData.contrasena) {
    formErrors.contrasena = "La contraseña es requerida";
  } else if (!validateContrasena(formData.contrasena)) {
    formErrors.contrasena = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial";
  }

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
  const errors = await validateFormData(userData);
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
  const errors = await validateFormData(userData);
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
