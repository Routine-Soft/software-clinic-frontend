import httpClient from "@/services/httpClient";

export async function getAllProntuarios(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.pacienteId) params.set('pacienteId', filtros.pacienteId);
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await httpClient.get(`/prontuarios${query}`);
  return response;
}

export async function getProntuarioById(id) {
  const response = await httpClient.get(`/prontuarios/${id}`);
  return response;
}

export async function createProntuario(newProntuario) {
  const response = await httpClient.post('/prontuarios', newProntuario);
  return response;
}

export async function updateProntuario(id, prontuarioData) {
  const response = await httpClient.patch(`/prontuarios/${id}`, prontuarioData);
  return response;
}

export async function finalizarAtendimento(id, prontuarioData) {
  const response = await httpClient.patch(`/prontuarios/${id}/finalizar`, prontuarioData);
  return response;
}

export async function deleteProntuario(id) {
  const response = await httpClient.delete(`/prontuarios/${id}`);
  return response;
}