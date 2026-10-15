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
// pais: país provável do visitante (Brasil vê os planos em reais; os demais, em dólar).
export async function getPlanosPublicos(pais) {
  const response = await httpClient.get(`/planos/publicos?pais=${encodeURIComponent(pais ?? 'BR')}`);
  return response;
}
