// roleService.js
const API_URL = 'http://localhost:3307/roles';

export const fetchRoles = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createRole = async (roleData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roleData),
  });

  if (!response.ok) {
    throw new Error('Error creating role');
  }
  return response.json();
};

export const updateRole = async (id, roleData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roleData),
  });

  if (!response.ok) {
    throw new Error('Error updating role');
  }
  return response.json();
};

export const deleteRole = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error deleting role');
  }

  // Verificar si la respuesta tiene cuerpo
  const text = await response.text();
  if (text) {
    return JSON.parse(text);
  } else {
    return {}; // O retornar algo apropiado si la respuesta está vacía
  }
};
