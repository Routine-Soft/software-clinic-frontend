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
    financeiro: { valor: '', vencimento: paraISO(new Date()), parcelamento: 1, formasPagamento: [] },
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
    },
  };
}

export function horarioInvalido(form) {
  return !!form.horaInicio && !!form.horaFim && form.horaFim <= form.horaInicio;
}

export function montarPayload(form, paciente) {
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
      valor: Number(form.financeiro.valor),
      vencimento: form.financeiro.vencimento,
      parcelamento: Number(form.financeiro.parcelamento) || 1,
      formasPagamento: form.financeiro.formasPagamento.map((f) => ({ ...f, valor: Number(f.valor) })),
    },
  };
}

// Preenche o valor pelo serviço + convênio do formulário (tabela do serviço, ou o preço padrão dele).
export function comPrecoDaTabela(form, servicos) {
  const servico = servicos.find((s) => s._id === form.servicoId);
  if (!servico) return form;
  return { ...form, financeiro: { ...form.financeiro, valor: regraDoServico(servico, form.convenioId).preco } };
}
