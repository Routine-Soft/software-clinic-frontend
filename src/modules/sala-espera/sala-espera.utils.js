// Em que pé está cada paciente de hoje na sala de espera.
export function situacaoNaSala(agenda) {
  if (agenda.status === 'realizado') return 'atendido';
  if (agenda.chamadoEm) return 'chamado';
  if (agenda.chegouEm) return 'aguardando';
  return 'agendado';
}

export const SITUACOES = {
  aguardando: { rotulo: 'Aguardando', tom: 'warning', vazio: 'Ninguém aguardando agora.' },
  chamado: { rotulo: 'Chamado', tom: 'info', vazio: 'Ninguém foi chamado ainda.' },
  agendado: { rotulo: 'Ainda não chegou', tom: 'muted', vazio: 'Todos os pacientes de hoje já chegaram.' },
  atendido: { rotulo: 'Atendido', tom: 'success', vazio: 'Nenhum atendimento concluído hoje.' },
};

export const ORDEM_DAS_SITUACOES = ['aguardando', 'chamado', 'agendado', 'atendido'];

export function minutosDesde(iso, agora = Date.now()) {
  return Math.max(0, Math.floor((agora - new Date(iso).getTime()) / 60000));
}

export function textoEspera(iso, agora) {
  const minutos = minutosDesde(iso, agora);
  if (minutos < 1) return 'chegou agora';
  if (minutos < 60) return `esperando há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `esperando há ${horas} h ${minutos % 60} min`;
}

export function horaBR(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
