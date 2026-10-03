import httpClient from '@/services/httpClient';

export async function getAvaliacoesNeuro() {
  return await httpClient.get('/avaliacoes-neuropsicologicas');
}

export async function getAvaliacaoNeuro(id) {
  return await httpClient.get(`/avaliacoes-neuropsicologicas/${id}`);
}

export async function createAvaliacaoNeuro(dados) {
  return await httpClient.post('/avaliacoes-neuropsicologicas', dados);
}

export async function updateAvaliacaoNeuro(id, dados) {
  return await httpClient.patch(`/avaliacoes-neuropsicologicas/${id}`, dados);
}

export async function finalizarAvaliacaoNeuro(id, dados) {
  return await httpClient.patch(`/avaliacoes-neuropsicologicas/${id}/finalizar`, dados);
}

export async function deleteAvaliacaoNeuro(id) {
  return await httpClient.delete(`/avaliacoes-neuropsicologicas/${id}`);
}
