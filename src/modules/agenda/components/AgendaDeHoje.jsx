import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useAgendas } from '../agenda.hooks';
import { STATUS_AGENDA, agendaAtiva, ehDoUsuario, paraISO } from '../agenda.utils';
import { useConfirmacoes } from '../confirmacoes.context';
import { Icone, IconeCheck, IconeMais } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import { tr } from '@/i18n';

// Lista curta ao lado do calendário. O profissional vê só os próprios; admin e recepção, a clínica toda.
// Quem usa remonta com outra `key` depois de criar/alterar um agendamento, para recarregar.
export default function AgendaDeHoje({ agora, onAbrir, onNovo, onConfirmar }) {
  const { user } = useAuthContext();
  const { modo, podeConfirmar } = useConfirmacoes();
  const [salvandoId, setSalvandoId] = useState(null);
  const hoje = paraISO(agora);
  const { agendas: daClinica, loading } = useAgendas({ dataInicio: hoje, dataFim: hoje });
  const agendas = user?.role === 'profissional' ? daClinica.filter((a) => ehDoUsuario(a, user)) : daClinica;
  const hhmm = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

  async function confirmar(agenda, acao) {
    setSalvandoId(agenda._id);
    await onConfirmar(agenda, acao);
    setSalvandoId(null);
  }

  return (
    <aside className="card agenda-hoje" aria-labelledby="agenda-hoje-titulo">
      <h3 id="agenda-hoje-titulo" className="agenda-hoje__titulo">
        {tr('Agenda de hoje')}
        {!loading && <span className="badge badge--primary">{agendas.filter(agendaAtiva).length}</span>}
      </h3>

      {loading ? (
        <ul className="agenda-hoje__lista" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <li key={i}><div className="skeleton skeleton--line" style={{ width: `${85 - i * 15}%` }} /></li>
          ))}
        </ul>
      ) : agendas.length === 0 ? (
        <div className="agenda-hoje__vazio">
          <Icone>{ICONES.agenda}</Icone>
          <p>{tr('Nenhum agendamento para hoje.')}</p>
          <button type="button" className="btn btn--primary btn--sm" onClick={onNovo}><IconeMais />{tr('Agendar')}</button>
        </div>
      ) : (
        <ul className="agenda-hoje__lista">
          {agendas.map((agenda, index) => {
            const aguardando = agenda.status === 'aguardando';
            const agoraMesmo = aguardando && agenda.horaInicio <= hhmm && hhmm < agenda.horaFim;
            const passou = aguardando && agenda.horaFim <= hhmm;
            // Em aberto: já aconteceu (ou o profissional finalizou) e ninguém confirmou.
            const emAberto = modo === 'recepcao' && aguardando && (passou || !!agenda.finalizadoEm);
            const alerta = emAberto && podeConfirmar;
            const salvando = salvandoId === agenda._id;
            return (
              <li key={agenda._id} style={{ '--i': index }}>
                <button
                  type="button"
                  className={`agenda-hoje__item is-${agenda.status}${passou && !emAberto ? ' is-passou' : ''}${agoraMesmo && !emAberto ? ' is-agora' : ''}${alerta ? ' is-pendente' : ''}`}
                  title={[agenda.pacienteId?.nome, agenda.profissionalId?.nome, agenda.servicoId?.nome, STATUS_AGENDA[agenda.status]].filter(Boolean).join(' · ')}
                  onClick={() => onAbrir(agenda)}
                >
                  <strong className="agenda-hoje__hora">{agenda.horaInicio}</strong>
                  <span className="agenda-hoje__dados">
                    <span className="agenda-hoje__nome">{agenda.pacienteId?.nome ?? tr('Paciente')}</span>
                    <span className="agenda-hoje__prof">{emAberto && agenda.finalizadoEm ? tr('Profissional finalizou') : agenda.profissionalId?.nome}</span>
                  </span>
                  {alerta && <span className="badge badge--warning">{tr('Confirmar')}</span>}
                  {emAberto && !podeConfirmar && <span className="badge badge--info">{tr('Aguardando confirmação')}</span>}
                  {!emAberto && agoraMesmo && <span className="badge badge--live badge--success">{tr('Agora')}</span>}
                  {agenda.status === 'realizado' && <span className="badge badge--success">{STATUS_AGENDA.realizado}</span>}
                  {!agendaAtiva(agenda) && <span className="badge badge--danger">{STATUS_AGENDA[agenda.status]}</span>}
                </button>
                {alerta && (
                  <div className="agenda-hoje__confirmar">
                    <button type="button" className="btn btn--sm confirmar-acoes__atendido" disabled={salvando} onClick={() => confirmar(agenda, 'atendido')}>
                      <IconeCheck />
                      {salvando ? tr('Salvando...') : tr('Atendido')}
                    </button>
                    <button type="button" className="btn btn--danger btn--sm" disabled={salvando} onClick={() => confirmar(agenda, 'falta')}>
                      {tr('Não veio')}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
