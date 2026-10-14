import httpClient from '@/services/httpClient';

export async function getSalaDeEspera() {
  return await httpClient.get('/sala-de-espera');
}

export async function definirChegada(id, chegou) {
  return await httpClient.patch(`/sala-de-espera/${id}/chegada`, { chegou });
}

export async function chamarPaciente(id) {
  return await httpClient.post(`/sala-de-espera/${id}/chamar`, {});
}
