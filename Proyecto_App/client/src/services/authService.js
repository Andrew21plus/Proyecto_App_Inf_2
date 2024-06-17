const API_URL = 'http://localhost:3307/usuarios';

export const fetchUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const authenticateUser = async (email, password) => {
  const users = await fetchUsers();
  return users.find(user => user.email === email && user.contrasena === password);
};
