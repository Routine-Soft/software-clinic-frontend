import httpClient from '@/services/httpClient';

// Resumo, formas de pagamento, despesas por categoria e extrato do período (diario, semanal, mensal ou anual
// que contém `data`, no formato AAAA-MM-DD).
export async function getFinanceiro(periodo, data) {
  const params = new URLSearchParams({ periodo, data });
  return await httpClient.get(`/financeiro?${params}`);
}

export async function criarDespesa(despesa) {
  return await httpClient.post('/financeiro/despesas', despesa);
}

export async function atualizarDespesa(id, despesa) {
  return await httpClient.patch(`/financeiro/despesas/${id}`, despesa);
}

export async function pagarDespesa(id, pago, formaPagamento) {
  return await httpClient.patch(`/financeiro/despesas/${id}/pagamento`, { pago, formaPagamento });
}

// `futuras`: numa despesa que se repete todo mês, também apaga as dos meses seguintes ainda não pagas.
export async function excluirDespesa(id, futuras = false) {
  return await httpClient.delete(`/financeiro/despesas/${id}${futuras ? '?futuras=true' : ''}`);
}
