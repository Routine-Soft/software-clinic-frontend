import httpClient from '@/services/httpClient';

export async function criarAfiliado(dados) {
  return await httpClient.post('/afiliados', dados);
}

export async function getPainelAfiliado() {
  return await httpClient.get('/afiliados/painel');
}

export async function getAfiliados() {
  return await httpClient.get('/afiliados');
}

export async function registrarPagamentoAfiliado(id) {
  return await httpClient.post(`/afiliados/${id}/pagamentos`, {});
}

export async function definirAfiliadoAtivo(id, ativo) {
  return await httpClient.patch(`/afiliados/${id}/ativo`, { ativo });
}

export async function ativarAfiliado(dados) {
  return await httpClient.post('/afiliados/ativar', dados);
}

export async function excluirAfiliado(id) {
  return await httpClient.delete(`/afiliados/${id}`);
}
