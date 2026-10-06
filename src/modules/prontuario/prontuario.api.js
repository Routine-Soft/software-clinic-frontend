import httpClient from "@/services/httpClient";

export async function getAllProntuarios(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.pacienteId) params.set('pacienteId', filtros.pacienteId);
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await httpClient.get(`/prontuarios${query}`);
  return response;
}

export async function getProntuarioById(id) {
  const response = await httpClient.get(`/prontuarios/${id}`);
  return response;
}

export async function createProntuario(newProntuario) {
  const response = await httpClient.post('/prontuarios', newProntuario);
  return response;
}

export async function updateProntuario(id, prontuarioData) {
  const response = await httpClient.patch(`/prontuarios/${id}`, prontuarioData);
  return response;
}

export async function finalizarAtendimento(id, prontuarioData) {
  const response = await httpClient.patch(`/prontuarios/${id}/finalizar`, prontuarioData);
  return response;
}

export async function adicionarAdendo(id, texto) {
  const response = await httpClient.post(`/prontuarios/${id}/adendos`, { texto });
  return response;
}

// Especialidades da clínica que podem ler o atendimento, além do autor.
export async function compartilharProntuario(id, compartilhadoCom) {
  const response = await httpClient.patch(`/prontuarios/${id}/compartilhamento`, { compartilhadoCom });
  return response;
}

export async function salvarPerfilClinico(pacienteId, perfil) {
  const response = await httpClient.patch(`/prontuarios/perfil/${pacienteId}`, perfil);
  return response;
}

// { profissional: { _id, nome } } quando o login pode abrir prontuários; { profissional: null } quando não.
export async function getAcessoProntuario() {
  const response = await httpClient.get('/prontuarios/acesso');
  return response;
}

// Quantidade de atendimentos abertos na clínica, sem dado clínico (recepção e admin).
export async function getTotalEmAtendimento() {
  const response = await httpClient.get('/prontuarios/em-atendimento');
  return response;
}
