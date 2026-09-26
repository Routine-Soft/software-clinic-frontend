import httpClient from "@/services/httpClient";

export async function getAllEmpresas() {
  const response = await httpClient.get('/empresas');
  return response;
}

export async function getEmpresaById(id) {
  const response = await httpClient.get(`/empresas/${id}`);
  return response;
}

export async function createEmpresa(newEmpresa) {
  const response = await httpClient.post('/empresas', newEmpresa);
  return response;
}

export async function updateEmpresa(id, empresaData) {
  const response = await httpClient.patch(`/empresas/${id}`, empresaData);
  return response;
}

export async function deleteEmpresa(id) {
  const response = await httpClient.delete(`/empresas/${id}`);
  return response;
}
