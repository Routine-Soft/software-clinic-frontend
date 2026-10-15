import { localeAtual, tr } from '@/i18n';

// Em que pé está cada paciente de hoje na sala de espera.
export function situacaoNaSala(agenda) {
  if (agenda.status === 'realizado') return 'atendido';
  if (agenda.chamadoEm) return 'chamado';
  if (agenda.chegouEm) return 'aguardando';
  return 'agendado';
}

export const SITUACOES = {
  aguardando: { rotulo: tr('Aguardando'), tom: 'warning', vazio: tr('Ninguém aguardando agora.') },
  chamado: { rotulo: tr('Chamado'), tom: 'info', vazio: tr('Ninguém foi chamado ainda.') },
  agendado: { rotulo: tr('Ainda não chegou'), tom: 'muted', vazio: tr('Todos os pacientes de hoje já chegaram.') },
  atendido: { rotulo: tr('Atendido'), tom: 'success', vazio: tr('Nenhum atendimento concluído hoje.') },
};

export const ORDEM_DAS_SITUACOES = ['aguardando', 'chamado', 'agendado', 'atendido'];

export function minutosDesde(iso, agora = Date.now()) {
  return Math.max(0, Math.floor((agora - new Date(iso).getTime()) / 60000));
}

export function textoEspera(iso, agora) {
  const minutos = minutosDesde(iso, agora);
  if (minutos < 1) return tr('chegou agora');
  if (minutos < 60) return tr('esperando há {minutos} min', { minutos });
  const horas = Math.floor(minutos / 60);
  return tr('esperando há {horas} h {p0} min', { horas, p0: minutos % 60 });
}

export function horaBR(iso) {
  return new Date(iso).toLocaleTimeString(localeAtual(), { hour: '2-digit', minute: '2-digit' });
}
