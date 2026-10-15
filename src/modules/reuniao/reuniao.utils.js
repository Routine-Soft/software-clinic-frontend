import { somarMinutos } from '@/modules/agenda/agendamento.form';

export const DURACAO_PADRAO_REUNIAO = 60;

// Mesmos valores de status da agenda, para o calendário reaproveitar as cores (riscado = cancelada).
export const STATUS_REUNIAO = {
  aguardando: ['Agendada', 'badge--info'],
  realizado: ['Realizada', 'badge--success'],
  cancelado: ['Cancelada', 'badge--danger'],
};

// Todas as reuniões usam a mesma cor no calendário (não há profissional para diferenciar).
export const COR_REUNIAO = 2;

export function descreverReuniao(reuniao) {
  return {
    nome: reuniao.nome,
    sub: null,
    extra: reuniao.observacoes,
    titulo: [
      `${reuniao.horaInicio} – ${reuniao.horaFim}`,
      reuniao.nome,
      reuniao.observacoes,
      reuniao.status === 'cancelado' ? 'Cancelada' : null,
    ].filter(Boolean).join(' · '),
  };
}

export function formularioNovaReuniao(slot) {
  return {
    nome: '',
    telefone: '',
    observacoes: '',
    data: slot?.data ?? '',
    horaInicio: slot?.horaInicio ?? '',
    horaFim: somarMinutos(slot?.horaInicio, DURACAO_PADRAO_REUNIAO),
  };
}

export function formularioDaReuniao(reuniao) {
  return {
    nome: reuniao.nome,
    telefone: reuniao.telefone ?? '',
    observacoes: reuniao.observacoes ?? '',
    data: reuniao.data.substring(0, 10),
    horaInicio: reuniao.horaInicio,
    horaFim: reuniao.horaFim,
  };
}

export function filtrarReunioes(reunioes, busca) {
  const termo = busca.trim().toLowerCase();
  if (!termo) return reunioes;
  const digitos = termo.replace(/\D/g, '');
  return reunioes.filter((r) =>
    r.nome.toLowerCase().includes(termo) ||
    (r.observacoes ?? '').toLowerCase().includes(termo) ||
    (digitos && (r.telefone ?? '').replace(/\D/g, '').includes(digitos))
  );
}
