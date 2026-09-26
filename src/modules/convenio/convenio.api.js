import httpClient from "@/services/httpClient";

export async function getAllConvenios() {
  const response = await httpClient.get('/convenios');
  return response;
}

export async function getConvenioById(id) {
  const response = await httpClient.get(`/convenios/${id}`);
  return response;
}

export async function createConvenio(newConvenio) {
  const response = await httpClient.post('/convenios', newConvenio);
  return response;
}

export async function updateConvenio(id, convenioData) {
  const response = await httpClient.patch(`/convenios/${id}`, convenioData);
  return response;
}

export async function deleteConvenio(id) {
  const response = await httpClient.delete(`/convenios/${id}`);
  return response;
}