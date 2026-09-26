import httpClient from "@/services/httpClient";

export async function getAllServicos() {
  const response = await httpClient.get('/servicos');
  return response;
}

export async function getServicoById(id) {
  const response = await httpClient.get(`/servicos/${id}`);
  return response;
}

export async function createServico(newServico) {
  const response = await httpClient.post('/servicos', newServico);
  return response;
}

export async function updateServico(id, servicoData) {
  const response = await httpClient.patch(`/servicos/${id}`, servicoData);
  return response;
}

export async function deleteServico(id) {
  const response = await httpClient.delete(`/servicos/${id}`);
  return response;
}