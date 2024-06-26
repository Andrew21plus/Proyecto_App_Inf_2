import axios from 'axios';

const API_URL = 'http://localhost:3307/usuarios';

const validateNombreApellido = (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);

const validateContrasena = (contrasena) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(contrasena);
  const hasNumber = /\d/.test(contrasena);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(contrasena);
  return contrasena.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
};

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const validateFormData = (formData) => {
  let errors = {};

  if (!validateNombreApellido(formData.nombre_usuario)) {
    errors.nombre_usuario = "El nombre solo puede contener letras";
  }

  if (!validateNombreApellido(formData.apellido_usuario)) {
    errors.apellido_usuario = "El apellido solo puede contener letras";
  }

  if (!validateEmail(formData.email)) {
    errors.email = "El email no es válido";
  }

  if (!validateContrasena(formData.contrasena)) {
    errors.contrasena = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial";
  }

  return errors;
};

const updateUser = async (id, formData) => {
  const errors = validateFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const response = await axios.put(`${API_URL}/${id}`, formData);
    return { data: response.data };
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return { error: 'Hubo un error al actualizar el perfil' };
  }
};

export { validateNombreApellido, validateContrasena, validateEmail, validateFormData, updateUser };
