import httpClient from "@/services/httpClient";

export async function getAllAvaliacoesNr01() {
  const response = await httpClient.get('/avaliacoes-nr01');
  return response;
}

export async function getAvaliacaoNr01ById(id) {
  const response = await httpClient.get(`/avaliacoes-nr01/${id}`);
  return response;
}

export async function createAvaliacaoNr01(newAvaliacao) {
  const response = await httpClient.post('/avaliacoes-nr01', newAvaliacao);
  return response;
}

export async function updateAvaliacaoNr01(id, avaliacaoData) {
  const response = await httpClient.patch(`/avaliacoes-nr01/${id}`, avaliacaoData);
  return response;
}

export async function deleteAvaliacaoNr01(id) {
  const response = await httpClient.delete(`/avaliacoes-nr01/${id}`);
  return response;
}
