import httpClient from "@/services/httpClient";

export async function loginUser(credentials) {
  const response = await httpClient.post('/users/login', credentials);
  return response;
}

export async function entrarComGoogle(credential, cadastro) {
  const response = await httpClient.post('/users/google', { credential, cadastro });
  return response;
}

export async function logoutUser() {
  const response = await httpClient.post('/users/logout');
  return response;
}

export async function getAllUsers() {
  const response = await httpClient.get('/users');
  return response;
}

export async function getMe() {
  const response = await httpClient.get('/users/me');
  return response;
}

export async function updateMe(userData) {
  const response = await httpClient.patch('/users/me', userData);
  return response;
}

export async function updateMyPassword(passwordData) {
  const response = await httpClient.post('/users/me/password', passwordData);
  return response;
}

export async function getUsersDaClinica() {
  const response = await httpClient.get('/users/tenant');
  return response;
}

export async function createUsuarioDaClinica(newUser) {
  const response = await httpClient.post('/users/tenant', newUser);
  return response;
}

export async function updateUsuarioDaClinica(id, userData) {
  const response = await httpClient.patch(`/users/tenant/${id}`, userData);
  return response;
}

export async function deleteUsuarioDaClinica(id) {
  const response = await httpClient.delete(`/users/tenant/${id}`);
  return response;
}

export async function resetPasswordUsuarioDaClinica(id, novaSenha) {
  const response = await httpClient.patch(`/users/tenant/${id}/senha`, { novaSenha });
  return response;
}

export async function getUserById(id) {
  const response = await httpClient.get(`/users/${id}`);
  return response;
}

export async function createUser(newUser) {
  const response = await httpClient.post('/users', newUser);
  return response;
}

export async function updateUser(id, userData) {
  const response = await httpClient.patch(`/users/${id}`, userData);
  return response;
}

export async function deleteUser(id) {
  const response = await httpClient.delete(`/users/${id}`);
  return response;
}

export async function updatePassword(id, passwordData) {
  const response = await httpClient.post(`/users/${id}/password`, passwordData);
  return response;
}