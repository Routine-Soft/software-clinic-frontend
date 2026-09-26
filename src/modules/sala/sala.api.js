import httpClient from "@/services/httpClient";

export async function getAllSalas() {
  const response = await httpClient.get('/salas');
  return response;
}

export async function getSalaById(id) {
  const response = await httpClient.get(`/salas/${id}`);
  return response;
}

export async function createSala(newSala) {
  const response = await httpClient.post('/salas', newSala);
  return response;
}

export async function updateSala(id, salaData) {
  const response = await httpClient.patch(`/salas/${id}`, salaData);
  return response;
}

export async function deleteSala(id) {
  const response = await httpClient.delete(`/salas/${id}`);
  return response;
}