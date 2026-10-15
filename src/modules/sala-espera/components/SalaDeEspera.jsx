import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Icone, IconeX } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import PaineisTvModal from '@/modules/painel-tv/components/PaineisTvModal';
import { useSalaDeEspera } from '../sala-espera.hooks';
import { situacaoNaSala, SITUACOES, ORDEM_DAS_SITUACOES, textoEspera, horaBR } from '../sala-espera.utils';
import '@/components/CrudCard/CrudCard.css';
import './sala-espera.css';
import { tr } from '@/i18n';

const IconeTv = () => (
  <Icone><rect width="20" height="14" x="2" y="3" rx="2" /><path d="M8 21h8M12 17v4" /></Icone>
);
const IconeChamar = () => (
  <Icone><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" /></Icone>
);

function detalhe(agenda, situacao, agora) {
  if (situacao === 'aguardando') return textoEspera(agenda.chegouEm, agora);
  if (situacao === 'chamado') return tr('chamado às {p0}', { p0: horaBR(agenda.chamadoEm) });
  return tr('{horaInicio} às {horaFim}', { horaInicio: agenda.horaInicio, horaFim: agenda.horaFim });
}

// Recepção marca quem chegou; recepção e profissional chamam o paciente, que aparece na TV da sala de espera.
export default function SalaDeEspera() {
  const { hasRole } = useAuthContext();
  const { agendas, loading, erro, sucesso, processando, agora, marcarChegada, chamar } = useSalaDeEspera();
  const [mostrandoTvs, setMostrandoTvs] = useState(false);
  const gerenciaTvs = hasRole('admin') || hasRole('recepcao') || hasRole('super_admin');

  const grupos = Object.fromEntries(ORDEM_DAS_SITUACOES.map((s) => [s, []]));
  agendas.forEach((a) => grupos[situacaoNaSala(a)].push(a));
  grupos.aguardando.sort((a, b) => new Date(a.chegouEm) - new Date(b.chegouEm));
  grupos.chamado.sort((a, b) => new Date(b.chamadoEm) - new Date(a.chamadoEm));

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Sala de espera')}</h2>
          <p className="page-subtitle">{tr('Pacientes de hoje. Ao chamar, o nome aparece na TV.')}</p>
        </div>
        {gerenciaTvs && (
          <div className="page-header__acoes">
            <button type="button" className="btn btn--ghost" onClick={() => setMostrandoTvs(true)}>
              <IconeTv /> {tr('TVs')}
            </button>
          </div>
        )}
      </header>

      {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}
      {sucesso && <p className="alert alert--success" role="status">{sucesso}</p>}

      {loading ? (
        <div className="espera-grade">
          {[0, 1].map((i) => (
            <section key={i} className="card espera-coluna">
              <div className="skeleton skeleton--line" style={{ width: '40%', height: 22 }} />
              <div className="skeleton skeleton--line" style={{ height: 64 }} />
              <div className="skeleton skeleton--line" style={{ height: 64 }} />
            </section>
          ))}
        </div>
      ) : agendas.length === 0 ? (
        <section className="card crud-vazio">
          <Icone>{ICONES.espera}</Icone>
          <p>{tr('Nenhum agendamento para hoje.')}</p>
        </section>
      ) : (
        <div className="espera-grade stagger">
          {ORDEM_DAS_SITUACOES.map((s, i) => (
            <section key={s} className="card espera-coluna" data-situacao={s} style={{ '--i': i }}>
              <header className="espera-coluna__topo">
                <h3>{SITUACOES[s].rotulo}</h3>
                <span className={`badge badge--${SITUACOES[s].tom}`}>{grupos[s].length}</span>
              </header>

              {grupos[s].length === 0 ? (
                <p className="espera-coluna__vazio">{SITUACOES[s].vazio}</p>
              ) : (
                <ul className="espera-lista">
                  {grupos[s].map((a) => {
                    const ocupado = processando === a.id;
                    return (
                      <li key={a.id} className="espera-paciente">
                        <div className="espera-paciente__info">
                          <strong>{a.paciente?.nome ?? '—'}</strong>
                          <span>{a.profissional} · {a.sala}{a.servico && ` · ${a.servico}`}</span>
                          <span className="espera-paciente__tempo">{detalhe(a, s, agora)}</span>
                        </div>

                        <div className="espera-paciente__acoes">
                          {s === 'agendado' && (
                            <button type="button" className="btn btn--ghost btn--sm" disabled={ocupado} onClick={() => marcarChegada(a.id)}>
                              {tr('Chegou')}
                            </button>
                          )}
                          {(s === 'aguardando' || s === 'agendado') && (
                            <button type="button" className={`btn btn--primary btn--sm${ocupado ? ' btn--loading' : ''}`} disabled={ocupado} onClick={() => chamar(a.id)}>
                              <IconeChamar /> {tr('Chamar')}
                            </button>
                          )}
                          {s === 'chamado' && (
                            <button type="button" className={`btn btn--ghost btn--sm${ocupado ? ' btn--loading' : ''}`} disabled={ocupado} onClick={() => chamar(a.id)}>
                              <IconeChamar /> {tr('Chamar de novo')}
                            </button>
                          )}
                          {(s === 'aguardando' || s === 'chamado') && (
                            <button
                              type="button"
                              className="icon-btn"
                              title={tr('Desfazer a chegada')}
                              aria-label={tr('Desfazer a chegada de {nome}', { nome: a.paciente?.nome })}
                              disabled={ocupado}
                              onClick={() => marcarChegada(a.id, false)}
                            >
                              <IconeX />
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {mostrandoTvs && <PaineisTvModal onClose={() => setMostrandoTvs(false)} />}
    </div>
  );
}
