import { useEffect, useMemo, useRef } from 'react';
import {
  NOMES_DIAS_CURTOS,
  horarioDosMinutos,
  idDoProfissional,
  paraISO,
  posicionarEventos,
  tituloDoAgendamento,
} from '../agenda.utils';

export const HORA_PX = 56;
const INICIO_PADRAO = 7;
const FIM_PADRAO = 20;
const ALTURA_MINIMA_DETALHES = 52;

export default function AgendaGradeTempo({ dias, porDia, corDe, hoje, agora, detalhado, onAbrir, onNovoEm, onIrParaDia }) {
  const rolagemRef = useRef(null);

  const posicionados = useMemo(
    () => new Map(dias.map((dia) => [paraISO(dia), posicionarEventos(porDia.get(paraISO(dia)) ?? [])])),
    [dias, porDia]
  );

  const { horaInicial, horaFinal, primeiroEvento } = useMemo(() => {
    let menor = Infinity;
    let maior = -Infinity;
    for (const lista of posicionados.values()) {
      for (const item of lista) {
        menor = Math.min(menor, item.inicio);
        maior = Math.max(maior, item.fim);
      }
    }
    return {
      horaInicial: Math.min(INICIO_PADRAO, Math.floor((menor === Infinity ? INICIO_PADRAO * 60 : menor) / 60)),
      horaFinal: Math.max(FIM_PADRAO, Math.ceil((maior === -Infinity ? FIM_PADRAO * 60 : maior) / 60)),
      primeiroEvento: menor === Infinity ? null : menor,
    };
  }, [posicionados]);

  const horas = Array.from({ length: horaFinal - horaInicial }, (_, i) => horaInicial + i);
  const alturaTotal = horas.length * HORA_PX;
  const chave = `${paraISO(dias[0])}-${dias.length}`;
  const contemHoje = dias.some((dia) => paraISO(dia) === hoje);
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  // Ao trocar de período, rola para perto do que interessa: agora (se estiver na visão) ou o primeiro agendamento.
  useEffect(() => {
    const alvo = contemHoje ? minutosAgora : primeiroEvento;
    if (!rolagemRef.current) return;
    const topo = alvo === null ? 0 : Math.max(0, ((alvo - horaInicial * 60) / 60 - 1) * HORA_PX);
    rolagemRef.current.scrollTop = topo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  function handleClickColuna(e, iso) {
    if (e.target !== e.currentTarget) return;
    const minutos = horaInicial * 60 + Math.floor(e.nativeEvent.offsetY / HORA_PX * 2) * 30;
    onNovoEm(iso, horarioDosMinutos(minutos));
  }

  return (
    <div className="agenda-tempo" data-dias={dias.length} style={{ '--hora': `${HORA_PX}px`, '--n': dias.length }}>
      <div className="agenda-tempo__rolagem" ref={rolagemRef}>
        <div className="agenda-tempo__miolo">
          <div className="agenda-tempo__cabecalho">
            <span className="agenda-tempo__canto" />
            {dias.map((dia) => {
              const iso = paraISO(dia);
              return (
                <button
                  key={iso}
                  type="button"
                  className={`agenda-tempo__dia${iso === hoje ? ' is-hoje' : ''}`}
                  disabled={dias.length === 1}
                  onClick={() => onIrParaDia(dia)}
                >
                  <span className="agenda-tempo__dia-nome">{NOMES_DIAS_CURTOS[dia.getDay()]}</span>
                  <span className="agenda-tempo__dia-numero">{dia.getDate()}</span>
                </button>
              );
            })}
          </div>

          <div className="agenda-tempo__corpo" style={{ height: alturaTotal }}>
            <div className="agenda-tempo__horas" aria-hidden="true">
              {horas.map((hora) => (
                <span key={hora} style={{ top: (hora - horaInicial) * HORA_PX }}>{hora === horaInicial ? '' : `${String(hora).padStart(2, '0')}:00`}</span>
              ))}
            </div>

            {dias.map((dia) => {
              const iso = paraISO(dia);
              return (
                <div
                  key={iso}
                  className={`agenda-tempo__coluna${iso === hoje ? ' is-hoje' : ''}`}
                  onClick={(e) => handleClickColuna(e, iso)}
                >
                  {posicionados.get(iso).map(({ agenda, inicio, fim, coluna, colunas }) => {
                    const altura = ((fim - inicio) / 60) * HORA_PX;
                    return (
                      <button
                        key={agenda._id}
                        type="button"
                        className="agenda-ev"
                        data-cor={corDe(idDoProfissional(agenda))}
                        data-status={agenda.status}
                        data-alto={altura >= ALTURA_MINIMA_DETALHES ? '' : undefined}
                        title={tituloDoAgendamento(agenda)}
                        style={{
                          top: ((inicio - horaInicial * 60) / 60) * HORA_PX,
                          height: altura - 2,
                          left: `calc(${(coluna / colunas) * 100}% + 2px)`,
                          width: `calc(${100 / colunas}% - 4px)`,
                        }}
                        onClick={() => onAbrir(agenda)}
                      >
                        <span className="agenda-ev__nome">{agenda.pacienteId?.nome ?? 'Paciente'}</span>
                        {agenda.profissionalId?.nome && <span className="agenda-ev__prof">{agenda.profissionalId.nome}</span>}
                        <span className="agenda-ev__hora">{agenda.horaInicio} – {agenda.horaFim}</span>
                        {(detalhado || altura >= 70) && (
                          <span className="agenda-ev__extra">
                            {[agenda.servicoId?.nome, detalhado ? agenda.salaId?.nome : null].filter(Boolean).join(' · ')}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {iso === hoje && minutosAgora >= horaInicial * 60 && minutosAgora <= horaFinal * 60 && (
                    <span className="agenda-agora" style={{ top: ((minutosAgora - horaInicial * 60) / 60) * HORA_PX }} aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
