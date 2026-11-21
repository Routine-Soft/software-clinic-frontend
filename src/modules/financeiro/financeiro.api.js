import httpClient from '@/services/httpClient';

// Resumo, formas de pagamento, despesas por categoria e extrato do período (diario, semanal, mensal ou anual
// que contém `data`, no formato AAAA-MM-DD).
export async function getFinanceiro(periodo, data) {
  const params = new URLSearchParams({ periodo, data });
  return await httpClient.get(`/financeiro?${params}`);
}

// Despesas e receitas avulsas (`tipo`: 'despesa' ou 'receita').
export async function criarLancamento(lancamento) {
  return await httpClient.post('/financeiro/lancamentos', lancamento);
}

export async function atualizarLancamento(id, lancamento) {
  return await httpClient.patch(`/financeiro/lancamentos/${id}`, lancamento);
}

export async function pagarLancamento(id, pago) {
  return await httpClient.patch(`/financeiro/lancamentos/${id}/pagamento`, { pago });
}

// `futuras`: num lançamento que se repete todo mês, também apaga os dos meses seguintes ainda não pagos.
export async function excluirLancamento(id, futuras = false) {
  return await httpClient.delete(`/financeiro/lancamentos/${id}${futuras ? '?futuras=true' : ''}`);
}

// Atendimento visto do Financeiro: valor, formas de pagamento e se foi recebido.
export async function editarAtendimento(id, dados) {
  return await httpClient.patch(`/financeiro/atendimentos/${id}`, dados);
}

export async function excluirAtendimento(id) {
  return await httpClient.delete(`/financeiro/atendimentos/${id}`);
}

// Desfaz um pagamento de repasse: os atendimentos voltam a ficar pendentes.
export async function desfazerRepasse(id) {
  return await httpClient.delete(`/financeiro/repasses/${id}`);
}
