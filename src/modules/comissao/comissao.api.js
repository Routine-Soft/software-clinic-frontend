import httpClient from "@/services/httpClient";

export async function getResumoComissoes() {
  return await httpClient.get('/comissoes/resumo');
}

export async function getPagamentosComissao() {
  return await httpClient.get('/comissoes/pagamentos');
}

export async function getPendentesComissao(profissionalId) {
  return await httpClient.get(`/comissoes/profissionais/${profissionalId}/pendentes`);
}

export async function pagarComissao(profissionalId) {
  return await httpClient.post(`/comissoes/profissionais/${profissionalId}/pagar`);
}

export async function getMinhasComissoes(periodo) {
  return await httpClient.get(`/comissoes/minhas?periodo=${encodeURIComponent(periodo)}`);
}
