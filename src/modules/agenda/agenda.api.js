import httpClient from "@/services/httpClient";

export async function getAllAgendas(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.profissionalId) params.set('profissionalId', filtros.profissionalId);
  if (filtros.dataInicio) params.set('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) params.set('dataFim', filtros.dataFim);

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await httpClient.get(`/agendas${query}`);
  return response;
}

export async function getAgendaById(id) {
  const response = await httpClient.get(`/agendas/${id}`);
  return response;
}

export async function createAgenda(newAgenda) {
  const response = await httpClient.post('/agendas', newAgenda);
  return response;
}

export async function updateAgenda(id, agendaData) {
  const response = await httpClient.patch(`/agendas/${id}`, agendaData);
  return response;
}

export async function cancelarAgenda(id) {
  const response = await httpClient.post(`/agendas/${id}/cancelar`);
  return response;
}

export async function cancelarGrupoRecorrencia(grupoRecorrenciaId) {
  const response = await httpClient.post(`/agendas/grupo/${grupoRecorrenciaId}/cancelar`);
  return response;
}

export async function deleteAgenda(id) {
  const response = await httpClient.delete(`/agendas/${id}`);
  return response;
}