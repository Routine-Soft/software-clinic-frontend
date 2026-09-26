import httpClient from "@/services/httpClient";

export async function getAllProfissionais() {
  const response = await httpClient.get('/profissionais');
  return response;
}

export async function getProfissionalById(id) {
  const response = await httpClient.get(`/profissionais/${id}`);
  return response;
}

export async function createProfissional(newProfissional) {
  const response = await httpClient.post('/profissionais', newProfissional);
  return response;
}

export async function updateProfissional(id, profissionalData) {
  const response = await httpClient.patch(`/profissionais/${id}`, profissionalData);
  return response;
}

export async function deleteProfissional(id) {
  const response = await httpClient.delete(`/profissionais/${id}`);
  return response;
}