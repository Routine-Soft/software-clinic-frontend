import httpClient from '@/services/httpClient';

export function getModelos() {
  return httpClient.get('/termos/modelos');
}

export function createModelo(dados) {
  return httpClient.post('/termos/modelos', dados);
}

export function updateModelo(id, dados) {
  return httpClient.patch(`/termos/modelos/${id}`, dados);
}

export function deleteModelo(id) {
  return httpClient.delete(`/termos/modelos/${id}`);
}

export function getTermos() {
  return httpClient.get('/termos');
}

export function getTermo(id) {
  return httpClient.get(`/termos/${id}`);
}

export function enviarTermo(dados) {
  return httpClient.post('/termos', dados);
}

export function cancelarTermo(id) {
  return httpClient.post(`/termos/${id}/cancelar`, {});
}

// Página do paciente (sem login): a chave do link vai na própria URL.
export function getTermoPublico(token) {
  return httpClient.get(`/termos/publico/${encodeURIComponent(token)}`);
}

export function assinarTermoPublico(token, dados) {
  return httpClient.post(`/termos/publico/${encodeURIComponent(token)}/assinar`, dados);
}
