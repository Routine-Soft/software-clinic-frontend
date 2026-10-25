import { useAuthContext } from '@/hooks/useAuthContext';
import { useAgendas } from '../agenda.hooks';
import { STATUS_AGENDA, ehDoUsuario, paraISO } from '../agenda.utils';
import { Icone, IconeMais } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import { tr } from '@/i18n';

// Lista curta ao lado do calendário. O profissional vê só os próprios; admin e recepção, a clínica toda.
// Quem usa remonta com outra `key` depois de criar/alterar um agendamento, para recarregar.
export default function AgendaDeHoje({ agora, onAbrir, onNovo }) {
  const { user } = useAuthContext();
  const hoje = paraISO(agora);
  const { agendas: daClinica, loading } = useAgendas({ dataInicio: hoje, dataFim: hoje });
  const agendas = user?.role === 'profissional' ? daClinica.filter((a) => ehDoUsuario(a, user)) : daClinica;
  const hhmm = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

  return (
    <aside className="card agenda-hoje" aria-labelledby="agenda-hoje-titulo">
      <h3 id="agenda-hoje-titulo" className="agenda-hoje__titulo">
        {tr('Agenda de hoje')}
        {!loading && <span className="badge badge--primary">{agendas.filter((a) => a.status !== 'cancelado').length}</span>}
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
            const cancelado = agenda.status === 'cancelado';
            const agoraMesmo = !cancelado && agenda.horaInicio <= hhmm && hhmm < agenda.horaFim;
            const passou = !cancelado && agenda.horaFim <= hhmm;
            return (
              <li key={agenda._id} style={{ '--i': index }}>
                <button
                  type="button"
                  className={`agenda-hoje__item${cancelado ? ' is-cancelado' : ''}${passou ? ' is-passou' : ''}${agoraMesmo ? ' is-agora' : ''}${agenda.status === 'realizado' ? ' is-realizado' : ''}`}
                  title={[agenda.pacienteId?.nome, agenda.profissionalId?.nome, agenda.servicoId?.nome, STATUS_AGENDA[agenda.status]].filter(Boolean).join(' · ')}
                  onClick={() => onAbrir(agenda)}
                >
                  <strong className="agenda-hoje__hora">{agenda.horaInicio}</strong>
                  <span className="agenda-hoje__dados">
                    <span className="agenda-hoje__nome">{agenda.pacienteId?.nome ?? tr('Paciente')}</span>
                    <span className="agenda-hoje__prof">{agenda.profissionalId?.nome}</span>
                  </span>
                  {agoraMesmo
                    ? <span className="badge badge--live badge--success">{tr('Agora')}</span>
                    : cancelado && <span className="badge badge--danger">{STATUS_AGENDA.cancelado}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
