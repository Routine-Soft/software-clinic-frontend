import httpClient from "@/services/httpClient";

export async function getAllListaEspera(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.especialidadeId) params.set('especialidadeId', filtros.especialidadeId);
  if (filtros.status) params.set('status', filtros.status);
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await httpClient.get(`/lista-espera${query}`);
  return response;
}

export async function getListaEsperaById(id) {
  const response = await httpClient.get(`/lista-espera/${id}`);
  return response;
}

export async function createListaEspera(newItem) {
  const response = await httpClient.post('/lista-espera', newItem);
  return response;
}

export async function updateListaEspera(id, itemData) {
  const response = await httpClient.patch(`/lista-espera/${id}`, itemData);
  return response;
}

export async function deleteListaEspera(id) {
  const response = await httpClient.delete(`/lista-espera/${id}`);
  return response;
}