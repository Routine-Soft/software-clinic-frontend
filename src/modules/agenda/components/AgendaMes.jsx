import { NOMES_DIAS_CURTOS, descreverAgendamento, paraISO } from '../agenda.utils';

const MAXIMO_POR_DIA = 3;

export default function AgendaMes({ dataReferencia, dias, porDia, corDe, descrever = descreverAgendamento, hoje, onAbrir, onNovoNoDia, onIrParaDia }) {
  return (
    <div className="agenda-mes">
      <div className="agenda-mes__semana" aria-hidden="true">
        {NOMES_DIAS_CURTOS.map((nome) => (
          <span key={nome}>{nome}</span>
        ))}
      </div>

      <div className="agenda-mes__grade">
        {dias.map((dia) => {
          const iso = paraISO(dia);
          const agendas = porDia.get(iso) ?? [];
          const visiveis = agendas.slice(0, MAXIMO_POR_DIA);
          const restantes = agendas.length - visiveis.length;
          const foraDoMes = dia.getMonth() !== dataReferencia.getMonth();

          return (
            <div
              key={iso}
              className={`agenda-celula${foraDoMes ? ' is-fora' : ''}${iso === hoje ? ' is-hoje' : ''}`}
              onClick={() => onNovoNoDia(iso)}
            >
              <button
                type="button"
                className="agenda-celula__numero"
                aria-label={`Ver o dia ${dia.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`}
                onClick={(e) => { e.stopPropagation(); onIrParaDia(dia); }}
              >
                {dia.getDate()}
              </button>

              <ul className="agenda-celula__lista">
                {visiveis.map((agenda) => {
                  const { nome, sub, titulo } = descrever(agenda);
                  return (
                  <li key={agenda._id}>
                    <button
                      type="button"
                      className="agenda-chip"
                      data-cor={corDe(agenda)}
                      data-status={agenda.status}
                      title={titulo}
                      onClick={(e) => { e.stopPropagation(); onAbrir(agenda); }}
                    >
                      <span className="agenda-chip__hora">{agenda.horaInicio}</span>
                      <span className="agenda-chip__nome">{nome}</span>
                      {sub && <span className="agenda-chip__prof">{sub}</span>}
                    </button>
                  </li>
                  );
                })}
              </ul>

              {restantes > 0 && (
                <button
                  type="button"
                  className="agenda-celula__mais"
                  onClick={(e) => { e.stopPropagation(); onIrParaDia(dia); }}
                >
                  +{restantes}<span> mais</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
