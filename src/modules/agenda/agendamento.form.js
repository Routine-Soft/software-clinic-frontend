import { horarioDosMinutos, minutosDoHorario, paraISO } from './agenda.utils';
import { regraDoServico } from '@/modules/servico/servico.utils';
import { tr } from '@/i18n';

export const DURACAO_PADRAO_MINUTOS = 30;

export const DIAS_SEMANA = [
  { valor: 0, label: tr('Dom') },
  { valor: 1, label: tr('Seg') },
  { valor: 2, label: tr('Ter') },
  { valor: 3, label: tr('Qua') },
  { valor: 4, label: tr('Qui') },
  { valor: 5, label: tr('Sex') },
  { valor: 6, label: tr('Sáb') },
];

export const FORMAS_PAGAMENTO = [
  ['pix', tr('Pix')],
  ['dinheiro', tr('Dinheiro')],
  ['cartao_credito', tr('Cartão de crédito')],
  ['cartao_debito', tr('Cartão de débito')],
];

export function somarMinutos(horario, minutos) {
  if (!horario) return '';
  const total = (((minutosDoHorario(horario) + minutos) % 1440) + 1440) % 1440;
  return horarioDosMinutos(total);
}

export function formularioNovo(slot) {
  return {
    data: slot?.data ?? '',
    horaInicio: slot?.horaInicio ?? '',
    horaFim: somarMinutos(slot?.horaInicio, DURACAO_PADRAO_MINUTOS),
    salaId: '',
    profissionalId: slot?.profissionalId ?? '',
    especialidadeId: '',
    servicoId: '',
    convenioId: '',
    financeiro: { valor: '', vencimento: paraISO(new Date()), parcelamento: 1, formasPagamento: [], gratuito: false, modoPagamento: 'avista' },
  };
}

export function formularioDaAgenda(agenda) {
  return {
    data: agenda.data.substring(0, 10),
    horaInicio: agenda.horaInicio,
    horaFim: agenda.horaFim,
    salaId: agenda.salaId?._id ?? agenda.salaId ?? '',
    profissionalId: agenda.profissionalId?._id ?? agenda.profissionalId ?? '',
    especialidadeId: '',
    servicoId: agenda.servicoId?._id ?? agenda.servicoId ?? '',
    convenioId: agenda.convenioId?._id ?? agenda.convenioId ?? '',
    financeiro: {
      valor: agenda.financeiro?.valor ?? '',
      vencimento: agenda.financeiro?.vencimento ? agenda.financeiro.vencimento.substring(0, 10) : '',
      parcelamento: agenda.financeiro?.parcelamento ?? 1,
      formasPagamento: agenda.financeiro?.formasPagamento ?? [],
      gratuito: Number(agenda.financeiro?.valor) === 0 && !agenda.financeiro?.formasPagamento?.length,
    },
  };
}

export function horarioInvalido(form) {
  return !!form.horaInicio && !!form.horaFim && form.horaFim <= form.horaInicio;
}

// Pelo plano o paciente não escolhe forma de pagamento: o valor segue só para o repasse do profissional.
export function montarPayload(form, paciente, peloPlano = false) {
  const gratuito = form.financeiro.gratuito && !peloPlano;
  return {
    data: form.data,
    horaInicio: form.horaInicio,
    horaFim: form.horaFim,
    salaId: form.salaId,
    pacienteId: paciente._id,
    profissionalId: form.profissionalId,
    servicoId: form.servicoId,
    convenioId: form.convenioId || null,
    financeiro: {
      valor: gratuito ? 0 : Number(form.financeiro.valor),
      vencimento: peloPlano ? form.data : form.financeiro.vencimento,
      parcelamento: gratuito || peloPlano ? 1 : Number(form.financeiro.parcelamento) || 1,
      modoPagamento: form.financeiro.modoPagamento,
      formasPagamento: gratuito || peloPlano ? [] : form.financeiro.formasPagamento.map((f) => ({ tipo: f.tipo, valor: Number(f.valor) })),
    },
  };
}

// Preenche o valor pelo serviço + convênio do formulário (tabela do serviço, ou o preço padrão dele)
// e o redistribui entre as formas de pagamento já escolhidas.
export function comPrecoDaTabela(form, servicos) {
  const servico = servicos.find((s) => s._id === form.servicoId);
  if (!servico) return form;
  const valor = regraDoServico(servico, form.convenioId).preco;
  return { ...form, financeiro: { ...form.financeiro, valor, formasPagamento: redistribuir(form.financeiro.formasPagamento, valor) } };
}

// Total da série: preço de uma sessão (serviço + convênio) vezes a quantidade.
export function comTotalDasSessoes(form, servicos, sessoes) {
  const comPreco = comPrecoDaTabela(form, servicos);
  const valor = Math.round(Number(comPreco.financeiro.valor) * sessoes * 100) / 100;
  return { ...comPreco, financeiro: { ...comPreco.financeiro, valor, formasPagamento: redistribuir(comPreco.financeiro.formasPagamento, valor) } };
}

// Divide o total igualmente entre `quantas` formas, em centavos; o que sobra do arredondamento fica na última.
export function dividirIgual(total, quantas) {
  const centavos = Math.round((Number(total) || 0) * 100);
  const parte = Math.floor(centavos / quantas);
  return Array.from({ length: quantas }, (_, i) => ((i === quantas - 1 ? centavos - parte * (quantas - 1) : parte) / 100).toFixed(2));
}

// Mesmas formas de pagamento, com o total redistribuído igualmente entre elas.
export function redistribuir(formasPagamento, total) {
  const valores = dividirIgual(total, formasPagamento.length || 1);
  return formasPagamento.map((f, i) => ({ ...f, valor: valores[i] }));
}

// Ao abrir a etapa de pagamento sem forma escolhida, já vem uma (Pix) com o total.
export function comFormaInicial(form) {
  const { financeiro } = form;
  if (financeiro.gratuito || financeiro.formasPagamento.length) return form;
  return { ...form, financeiro: { ...financeiro, formasPagamento: redistribuir([{ tipo: 'pix' }], financeiro.valor) } };
}

export function somaDasFormas(formasPagamento) {
  return Math.round(formasPagamento.reduce((soma, f) => soma + (Number(f.valor) || 0), 0) * 100) / 100;
}
