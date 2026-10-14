import httpClient from '@/services/httpClient';

// --- Usado pela TV (sem login) ---

export async function iniciarPareamento() {
  return await httpClient.post('/painel-tv/pareamento', {});
}

export async function situacaoDoPareamento(segredo) {
  return await httpClient.post('/painel-tv/pareamento/situacao', { segredo });
}

export async function getTelaDaTv(chave) {
  return await httpClient.get('/painel-tv/tela', { headers: { Authorization: `Painel ${chave}` } });
}

// --- Usado pela clínica (logada) ---

export async function getPaineisTv() {
  return await httpClient.get('/paineis-tv');
}

export async function conectarPainelTv(dados) {
  return await httpClient.post('/paineis-tv', dados);
}

export async function renomearPainelTv(id, nome) {
  return await httpClient.patch(`/paineis-tv/${id}`, { nome });
}

export async function desconectarPainelTv(id) {
  return await httpClient.delete(`/paineis-tv/${id}`);
}
