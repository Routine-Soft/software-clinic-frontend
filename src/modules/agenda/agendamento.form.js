import { horarioDosMinutos, minutosDoHorario, paraISO } from './agenda.utils';
import { regraDoServico } from '@/modules/servico/servico.utils';

export const DURACAO_PADRAO_MINUTOS = 30;

export const DIAS_SEMANA = [
  { valor: 0, label: 'Dom' },
  { valor: 1, label: 'Seg' },
  { valor: 2, label: 'Ter' },
  { valor: 3, label: 'Qua' },
  { valor: 4, label: 'Qui' },
  { valor: 5, label: 'Sex' },
  { valor: 6, label: 'Sáb' },
];

export const FORMAS_PAGAMENTO = [
  ['pix', 'Pix'],
  ['dinheiro', 'Dinheiro'],
  ['cartao_credito', 'Cartão de crédito'],
  ['cartao_debito', 'Cartão de débito'],
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

// Preenche o valor pelo serviço + convênio do formulário (tabela do serviço, ou preço particular).
export function comPrecoDaTabela(form, servicos) {
  const servico = servicos.find((s) => s._id === form.servicoId);
  if (!servico) return form;
  return { ...form, financeiro: { ...form.financeiro, valor: regraDoServico(servico, form.convenioId).preco } };
}
