import { localeAtual, tr } from '@/i18n';

export function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString(localeAtual(), { style: 'currency', currency: 'BRL' });
}

function formatarPercentual(valor) {
  return `${Number(valor || 0).toLocaleString(localeAtual(), { maximumFractionDigits: 2 })}%`;
}

// Regra (preço + repasse) do serviço para um convênio; sem convênio, ou convênio fora da tabela, vale a padrão.
export function regraDoServico(servico, convenioId) {
  const linha = convenioId ? (servico?.tabelaConvenios ?? []).find((l) => String(l.convenioId) === String(convenioId)) : null;
  const origem = linha ?? servico ?? {};
  return { preco: origem.preco ?? 0, comissao: origem.comissao ?? 0, comissaoTipo: origem.comissaoTipo ?? 'valor', doConvenio: !!linha };
}

export function valorDaComissao({ comissao, comissaoTipo }, preco) {
  const valor = Number(comissao) || 0;
  return comissaoTipo === 'percentual' ? Math.round((Number(preco) || 0) * valor) / 100 : valor;
}

// Repasse de uma linha da tabela, para a lista de serviços: "repasse 20% (R$ 20,00)", "repasse R$ 40,00" ou "sem repasse".
export function textoComissaoDaLinha(regra) {
  if (!(Number(regra.comissao) > 0)) return tr('sem repasse');
  if (regra.comissaoTipo !== 'percentual') return `repasse ${formatarPreco(regra.comissao)}`;
  return tr('repasse {p0} ({p1})', { p0: formatarPercentual(regra.comissao), p1: formatarPreco(valorDaComissao(regra, regra.preco)) });
}

// Repasse já calculado de um atendimento, com o percentual quando foi por percentual: "R$ 60,00 (20%)".
export function textoComissaoCalculada(valor, percentual) {
  return percentual != null ? `${formatarPreco(valor)} (${formatarPercentual(percentual)})` : formatarPreco(valor);
}

// Texto de apoio de uma linha da tabela: mostra na hora quanto fica para o profissional e para a clínica.
export function dicaComissao(preco, comissao, comissaoTipo = 'valor') {
  const valorPreco = Number(preco) || 0;
  const valorComissao = Number(comissao) || 0;
  if (comissaoTipo === 'percentual' && valorComissao > 100) return tr('O percentual não pode passar de 100%.');
  if (comissaoTipo === 'valor' && valorComissao > valorPreco) return tr('O repasse não pode ser maior que o preço.');
  if (valorComissao === 0) return tr('Sem repasse: o valor todo fica com a clínica.');
  const doProfissional = valorDaComissao({ comissao: valorComissao, comissaoTipo }, valorPreco);
  return tr('Por atendimento: {p0} para o profissional e {p1} para a clínica.', { p0: formatarPreco(doProfissional), p1: formatarPreco(valorPreco - doProfissional) });
}
