import httpClient from '@/services/httpClient';

// Modelos da clínica
export function getModelos() {
  return httpClient.get('/anamneses/modelos');
}

export function getModelo(id) {
  return httpClient.get(`/anamneses/modelos/${id}`);
}

export function createModelo(dados) {
  return httpClient.post('/anamneses/modelos', dados);
}

export function updateModelo(id, dados) {
  return httpClient.patch(`/anamneses/modelos/${id}`, dados);
}

export function duplicarModelo(id) {
  return httpClient.post(`/anamneses/modelos/${id}/duplicar`, {});
}

export function deleteModelo(id) {
  return httpClient.delete(`/anamneses/modelos/${id}`);
}

// Anamneses do prontuário
export function getAnamneses(pacienteId) {
  return httpClient.get(`/anamneses?pacienteId=${encodeURIComponent(pacienteId)}`);
}

export function getAnamnese(id) {
  return httpClient.get(`/anamneses/${id}`);
}

export function createAnamnese(dados) {
  return httpClient.post('/anamneses', dados);
}

export function updateAnamnese(id, dados) {
  return httpClient.patch(`/anamneses/${id}`, dados);
}
