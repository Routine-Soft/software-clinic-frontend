import { localeAtual, tr } from '@/i18n';
import { formatarPreco } from '@/modules/servico/servico.utils';

// Mesmas categorias do backend (lancamento.model.js).
export const CATEGORIAS_DESPESA = [
  ['aluguel', tr('Aluguel e condomínio')],
  ['pessoal', tr('Salários e encargos')],
  ['materiais', tr('Materiais e insumos')],
  ['contas', tr('Água, luz, internet e telefone')],
  ['impostos', tr('Impostos e taxas')],
  ['marketing', tr('Marketing e divulgação')],
  ['sistemas', tr('Sistemas e assinaturas')],
  ['manutencao', tr('Manutenção e limpeza')],
  ['terceiros', tr('Serviços de terceiros (contador, etc.)')],
  ['equipamentos', tr('Equipamentos e móveis')],
  ['outros', tr('Outros')],
];

export const CATEGORIAS_RECEITA = [
  ['convenio', tr('Pagamento de convênio')],
  ['produtos', tr('Venda de produtos')],
  ['servicos', tr('Serviço avulso')],
  ['sublocacao', tr('Sublocação de sala')],
  ['outros', tr('Outros')],
];

export const CATEGORIAS = { despesa: CATEGORIAS_DESPESA, receita: CATEGORIAS_RECEITA };

export const ROTULO_CATEGORIA = Object.fromEntries([...CATEGORIAS_DESPESA, ...CATEGORIAS_RECEITA]);

// Formas de pagamento: as do atendimento e as que só aparecem nos lançamentos (boleto, transferência).
export const ROTULO_FORMA = {
  pix: tr('Pix'),
  dinheiro: tr('Dinheiro'),
  cartao_credito: tr('Cartão de crédito'),
  cartao_debito: tr('Cartão de débito'),
  boleto: tr('Boleto'),
  transferencia: tr('Transferência'),
};

export const FORMAS_LANCAMENTO = ['pix', 'dinheiro', 'cartao_credito', 'cartao_debito', 'boleto', 'transferencia'];
export const FORMAS_ATENDIMENTO = ['pix', 'dinheiro', 'cartao_credito', 'cartao_debito'];

// Despesa ou receita avulsa (lançadas à mão no Financeiro).
export function ehLancamento(linha) {
  return linha.origem === 'despesa' || linha.origem === 'receita';
}

export const ROTULO_PAPEL = { admin: tr('Administração'), recepcao: tr('Recepção'), super_admin: tr('Suporte'), profissional: tr('Profissional') };

const COMPARACAO = { diario: tr('vs. dia anterior'), semanal: tr('vs. semana anterior'), mensal: tr('vs. mês anterior'), anual: tr('vs. ano anterior') };

export function dinheiro(valor) {
  return formatarPreco(valor);
}

// Hoje no relógio de Brasília, como AAAA-MM-DD.
export function hojeISO() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

function diaPuro(iso) {
  return new Date(`${String(iso).slice(0, 10)}T00:00:00.000Z`);
}

// Datas do Financeiro são "dia puro" (meia-noite UTC): formatar sempre em UTC para não voltar um dia.
export function formatarDia(iso, opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  return diaPuro(iso).toLocaleDateString(localeAtual(), { timeZone: 'UTC', ...opcoes });
}

// Anda `passos` períodos para trás (negativo) ou para frente a partir da data de referência.
export function deslocarData(periodo, iso, passos) {
  const d = diaPuro(iso);
  if (periodo === 'diario') d.setUTCDate(d.getUTCDate() + passos);
  else if (periodo === 'semanal') d.setUTCDate(d.getUTCDate() + 7 * passos);
  else if (periodo === 'mensal') d.setUTCMonth(d.getUTCMonth() + passos, 1);
  else d.setUTCFullYear(d.getUTCFullYear() + passos, 0, 1);
  return d.toISOString().slice(0, 10);
}

function maiuscula(texto) {
  return texto ? `${texto.charAt(0).toUpperCase()}${texto.slice(1)}` : texto;
}

// "Sábado, 21/11/2026", "15/11 a 21/11/2026", "Novembro de 2026", "2026".
export function rotuloDoPeriodo(periodo, inicio, fim) {
  if (!inicio) return '';
  if (periodo === 'diario') return maiuscula(formatarDia(inicio, { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }));
  if (periodo === 'semanal') return tr('{p0} a {p1}', { p0: formatarDia(inicio, { day: '2-digit', month: '2-digit' }), p1: formatarDia(fim) });
  if (periodo === 'mensal') return maiuscula(formatarDia(inicio, { month: 'long', year: 'numeric' }));
  return formatarDia(inicio, { year: 'numeric' });
}

// "+12% vs. mês anterior" (null quando não há base para comparar).
export function textoVariacao(atual, anterior, periodo) {
  if (!anterior) return null;
  const variacao = Math.round(((atual - anterior) / Math.abs(anterior)) * 100);
  const sinal = variacao > 0 ? '+' : '';
  return { texto: `${sinal}${variacao}% ${COMPARACAO[periodo] ?? ''}`.trim(), positiva: variacao >= 0 };
}

// Texto das formas de pagamento de um lançamento do extrato.
export function textoDaForma(linha) {
  if (ehLancamento(linha)) return linha.formaPagamento ? ROTULO_FORMA[linha.formaPagamento] ?? linha.formaPagamento : '—';
  if (linha.origem === 'repasse') return '—';
  if (linha.formas?.length) return linha.formas.map((f) => ROTULO_FORMA[f.tipo] ?? f.tipo).join(' + ');
  if (linha.situacao === 'convenio') return tr('Convênio');
  if (linha.situacao === 'pacote') return tr('Pacote');
  return '—';
}

// Situação do lançamento: texto e cor do selo.
export function situacaoDaLinha(linha) {
  switch (linha.situacao) {
    case 'pago': return { texto: linha.tipo === 'entrada' ? tr('Recebido') : tr('Pago'), tom: 'success' };
    case 'a_receber': return { texto: tr('A receber'), tom: 'warning' };
    case 'a_pagar': return { texto: tr('A pagar'), tom: 'warning' };
    case 'vencida': return { texto: tr('Vencida'), tom: 'danger' };
    case 'gratuito': return { texto: tr('Gratuito'), tom: 'info' };
    case 'convenio': return { texto: linha.coparticipacaoPaga ? tr('Convênio (coparticipação paga)') : tr('Convênio'), tom: 'info' };
    case 'pacote': return { texto: tr('Pacote: {p0} de {p1} parcelas pagas', { p0: linha.parcelas?.pagas ?? 0, p1: linha.parcelas?.total ?? 0 }), tom: linha.parcelas?.pagas === linha.parcelas?.total ? 'success' : 'warning' };
    default: return { texto: '—', tom: 'info' };
  }
}

export function descricaoDaLinha(linha) {
  if (linha.origem === 'atendimento') return linha.paciente ?? tr('Paciente removido');
  if (linha.origem === 'repasse') return tr('Repasse para {nome}', { nome: linha.profissional ?? tr('Profissional removido') });
  return linha.descricao;
}

// Quem recebeu (atendimento) ou quem pagou (despesa e repasse).
export function responsavelDaLinha(linha) {
  if (linha.origem === 'atendimento') return linha.recebidoPor ? { nome: linha.recebidoPor.nome, papel: ROTULO_PAPEL[linha.recebidoPor.papel] ?? null } : null;
  return linha.pagoPor ? { nome: linha.pagoPor, papel: null } : null;
}

function celulaCsv(valor) {
  const texto = String(valor ?? '');
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

// Planilha do extrato (CSV com ";", que o Excel em português abre direto).
export function baixarExtratoCsv(linhas, nomeArquivo) {
  const cabecalho = [tr('Data'), tr('Hora'), tr('Tipo'), tr('Descrição'), tr('Serviço'), tr('Profissional'), tr('Convênio'), tr('Categoria'), tr('Forma de pagamento'), tr('Situação'), tr('Recebido/pago por'), tr('Valor'), tr('Repasse')];
  const corpo = linhas.map((l) => {
    const responsavel = responsavelDaLinha(l);
    const valor = (l.tipo === 'saida' ? -l.valor : l.valor).toFixed(2).replace('.', ',');
    return [
      formatarDia(l.data),
      l.hora ?? '',
      l.tipo === 'entrada' ? tr('Entrada') : tr('Saída'),
      descricaoDaLinha(l),
      l.servico ?? '',
      l.profissional ?? '',
      l.convenio ?? '',
      l.categoria ? ROTULO_CATEGORIA[l.categoria] ?? l.categoria : '',
      textoDaForma(l),
      situacaoDaLinha(l).texto,
      responsavel ? responsavel.nome : '',
      valor,
      l.repasse ? l.repasse.toFixed(2).replace('.', ',') : '',
    ].map(celulaCsv).join(';');
  });
  const blob = new Blob([`\uFEFF${[cabecalho.join(';'), ...corpo].join('\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}
