import httpClient from "@/services/httpClient";

// Painel do super_admin: gestão das clínicas (cada uma é um usuário "admin") e suas assinaturas.

export async function getResumoAdmins() {
  const response = await httpClient.get('/users/admins/resumo');
  return response;
}

export async function getAdmins(busca) {
  const query = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  const response = await httpClient.get(`/users/admins${query}`);
  return response;
}

export async function getReceitaAdmins(periodo) {
  const response = await httpClient.get(`/users/admins/receita?periodo=${encodeURIComponent(periodo)}`);
  return response;
}

export async function criarAdmin(dados) {
  const response = await httpClient.post('/users/admins', dados);
  return response;
}

export async function editarAdmin(id, dados) {
  const response = await httpClient.patch(`/users/admins/${id}`, dados);
  return response;
}

export async function apagarAdmin(id) {
  const response = await httpClient.delete(`/users/admins/${id}`);
  return response;
}

export async function trocarPlanoAdmin(id, planoId) {
  const response = await httpClient.patch(`/users/admins/${id}/plano`, { planoId });
  return response;
}

export async function estenderTesteAdmin(id) {
  const response = await httpClient.patch(`/users/admins/${id}/estender-teste`);
  return response;
}

export async function definirRevogacaoAdmin(id, revogado) {
  const response = await httpClient.patch(`/users/admins/${id}/acesso`, { revogado });
  return response;
}
