import httpClient from "@/services/httpClient";

export async function getAllPlanos() {
  const response = await httpClient.get('/planos');
  return response;
}

export async function getPlanoById(id) {
  const response = await httpClient.get(`/planos/${id}`);
  return response;
}

export async function createPlano(newPlano) {
  const response = await httpClient.post('/planos', newPlano);
  return response;
}

export async function updatePlano(id, planoData) {
  const response = await httpClient.patch(`/planos/${id}`, planoData);
  return response;
}

export async function deletePlano(id) {
  const response = await httpClient.delete(`/planos/${id}`);
  return response;
}
// Sem login: os planos à venda, para a landing.
export async function getPlanosPublicos() {
  const response = await httpClient.get('/planos/publicos');
  return response;
}
