export function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarPercentual(valor) {
  return `${Number(valor || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
}

// Regra (preço + comissão) do serviço para um convênio; sem convênio, ou convênio fora da tabela, vale a particular.
export function regraDoServico(servico, convenioId) {
  const linha = convenioId ? (servico?.tabelaConvenios ?? []).find((l) => String(l.convenioId) === String(convenioId)) : null;
  const origem = linha ?? servico ?? {};
  return { preco: origem.preco ?? 0, comissao: origem.comissao ?? 0, comissaoTipo: origem.comissaoTipo ?? 'valor', doConvenio: !!linha };
}

export function valorDaComissao({ comissao, comissaoTipo }, preco) {
  const valor = Number(comissao) || 0;
  return comissaoTipo === 'percentual' ? Math.round((Number(preco) || 0) * valor) / 100 : valor;
}

// Comissão de uma linha da tabela, para a lista de serviços: "20% (R$ 20,00)", "R$ 40,00" ou "sem comissão".
export function textoComissaoDaLinha(regra) {
  if (!(Number(regra.comissao) > 0)) return 'sem comissão';
  if (regra.comissaoTipo !== 'percentual') return `comissão ${formatarPreco(regra.comissao)}`;
  return `comissão ${formatarPercentual(regra.comissao)} (${formatarPreco(valorDaComissao(regra, regra.preco))})`;
}

// Comissão já calculada de um atendimento, com o percentual quando foi por percentual: "R$ 60,00 (20%)".
export function textoComissaoCalculada(valor, percentual) {
  return percentual != null ? `${formatarPreco(valor)} (${formatarPercentual(percentual)})` : formatarPreco(valor);
}

// Texto de apoio de uma linha da tabela: mostra na hora quanto fica para o profissional e para a clínica.
export function dicaComissao(preco, comissao, comissaoTipo = 'valor') {
  const valorPreco = Number(preco) || 0;
  const valorComissao = Number(comissao) || 0;
  if (comissaoTipo === 'percentual' && valorComissao > 100) return 'O percentual não pode passar de 100%.';
  if (comissaoTipo === 'valor' && valorComissao > valorPreco) return 'A comissão não pode ser maior que o preço.';
  if (valorComissao === 0) return 'Sem comissão: o valor todo fica com a clínica.';
  const doProfissional = valorDaComissao({ comissao: valorComissao, comissaoTipo }, valorPreco);
  return `Por atendimento: ${formatarPreco(doProfissional)} para o profissional e ${formatarPreco(valorPreco - doProfissional)} para a clínica.`;
}
