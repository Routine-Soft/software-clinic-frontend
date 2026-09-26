import httpClient from "@/services/httpClient";

export async function getAllEspecialidades() {
  const response = await httpClient.get('/especialidades');
  return response;
}

export async function getEspecialidadeById(id) {
  const response = await httpClient.get(`/especialidades/${id}`);
  return response;
}

export async function createEspecialidade(newEspecialidade) {
  const response = await httpClient.post('/especialidades', newEspecialidade);
  return response;
}

export async function updateEspecialidade(id, especialidadeData) {
  const response = await httpClient.patch(`/especialidades/${id}`, especialidadeData);
  return response;
}

export async function deleteEspecialidade(id) {
  const response = await httpClient.delete(`/especialidades/${id}`);
  return response;
}