import httpClient from "@/services/httpClient";

export async function getAllReunioes(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.dataInicio) params.set('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) params.set('dataFim', filtros.dataFim);

  const query = params.toString() ? `?${params.toString()}` : '';
  return await httpClient.get(`/reunioes${query}`);
}

export async function createReuniao(reuniao) {
  return await httpClient.post('/reunioes', reuniao);
}

export async function updateReuniao(id, dados) {
  return await httpClient.patch(`/reunioes/${id}`, dados);
}

export async function deleteReuniao(id) {
  return await httpClient.delete(`/reunioes/${id}`);
}
