const API_URL = 'http://localhost:3307/roles';

export const fetchRoles = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};