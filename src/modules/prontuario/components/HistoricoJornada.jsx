import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { IconeMais } from '@/components/CrudCard/icones';
import { primeiroNome } from '@/utils/nome';
import EvolucaoItem from './EvolucaoItem';
import { CAMPOS_TEXTO, formatDuracao, formatDataInstanteBR, formatHoraBR, ehDoProfissional } from '../prontuario.utils';
import { tr } from '@/i18n';

function Boneco({ paciente }) {
  return (
    <div className="jornada-boneco">
      <svg className="jornada-boneco__figura" viewBox="0 0 64 84" aria-hidden="true">
        <ellipse className="jornada-boneco__sombra" cx="32" cy="80" rx="18" ry="3.5" />
        <path className="jornada-boneco__perna" d="M24 62v12M40 62v12" />
        <path className="jornada-boneco__braco" d="M14 44c-3 5-4 10-3 14M50 44c3 5 4 10 3 14" />
        <rect className="jornada-boneco__corpo" x="13" y="36" width="38" height="30" rx="14" />
        <circle className="jornada-boneco__cabeca" cx="32" cy="20" r="15" />
        <circle className="jornada-boneco__olho" cx="26.5" cy="19" r="1.8" />
        <circle className="jornada-boneco__olho" cx="37.5" cy="19" r="1.8" />
        <path className="jornada-boneco__sorriso" d="M27 25c3 2.5 7 2.5 10 0" />
      </svg>
      <span className="jornada-boneco__nome">{primeiroNome(paciente.nome)}</span>
    </div>
  );
}

function resumoDasAnotacoes(prontuario) {
  const campo = CAMPOS_TEXTO.find(([nome]) => prontuario[nome]);
  return campo ? prontuario[campo[0]] : null;
}

// Histórico do prontuário em forma de jornada: o paciente (boneco) e, ligados por setas, os atendimentos
// como fases. Clicar numa fase abre o atendimento completo numa janela menor, por cima do prontuário.
export default function HistoricoJornada({ paciente, historico, loading, profissional, especialidades, agendamento, podeIniciar, onIniciar, onCompartilhar, onAdendo }) {
  const [aberto, setAberto] = useState(null);

  const total = historico.length;
  const faseAberta = aberto && historico.find((p) => p._id === aberto.id);

  return (
    <aside className="pront-jornada" aria-label={tr('Histórico de atendimentos')}>
      <header className="pront-jornada__topo">
        <h4 className="pront-jornada__titulo">{tr('Jornada do paciente')}</h4>
        <p className="pront-jornada__sub">{total === 1 ? tr('1 atendimento') : tr('{n} atendimentos', { n: total })}</p>
      </header>

      {loading ? (
        <div className="skeleton skeleton--bloco" />
      ) : total === 0 ? (
        <div className="pront-jornada__vazio">
          <Boneco paciente={paciente} />
          <p>{tr('A jornada começa no primeiro atendimento.')}</p>
          {podeIniciar && (
            <button type="button" className="btn btn--primary btn--sm pront-no-print" onClick={onIniciar}>
              <IconeMais />
              {tr('Iniciar atendimento')}
            </button>
          )}
        </div>
      ) : (
        <div className="pront-jornada__mapa">
          <div className="pront-jornada__trilha">
            <Boneco paciente={paciente} />
          </div>

          <ol className="pront-jornada__fases">
            {historico.map((prontuario, index) => {
              const finalizado = !!prontuario.atendimentoFinalizadoEm;
              const souAutor = ehDoProfissional(prontuario, profissional._id);
              const anotacoes = resumoDasAnotacoes(prontuario);
              const adendos = prontuario.adendos?.length ?? 0;
              const data = formatDataInstanteBR(prontuario.createdAt);
              const destaque = !!agendamento && prontuario.agendamentoId === agendamento._id;
              return (
                <li key={prontuario._id} className={`jornada-fase${finalizado ? '' : ' jornada-fase--andamento'}${destaque ? ' jornada-fase--destaque' : ''}`} style={{ '--i': Math.min(index, 10) }}>
                  <button
                    type="button"
                    className="jornada-fase__abrir"
                    aria-label={tr('Ver o atendimento de {data}', { data })}
                    onClick={() => setAberto({ id: prontuario._id, adendo: false })}
                  />
                  <div className="jornada-fase__topo">
                    <span className="jornada-fase__numero">{tr('{n}ª consulta', { n: total - index })}</span>
                    <span className="jornada-fase__quando">{data} · {formatHoraBR(prontuario.createdAt)}</span>
                  </div>
                  <p className="jornada-fase__meta">
                    {finalizado && prontuario.atendimentoIniciadoEm
                      ? <span>⏱ {formatDuracao(prontuario.atendimentoIniciadoEm, prontuario.atendimentoFinalizadoEm)}</span>
                      : <span className="badge badge--live">{tr('Em andamento')}</span>}
                    <span>{prontuario.profissionalId?.nome ?? tr('Profissional removido')}</span>
                  </p>
                  <p className={`jornada-fase__notas${anotacoes ? '' : ' is-vazio'}`}>{anotacoes ?? tr('Sem anotações')}</p>
                  {(destaque || adendos > 0 || (souAutor && finalizado)) && (
                    <div className="jornada-fase__rodape">
                      {destaque && <span className="badge badge--success">{tr('Desta consulta')}</span>}
                      {adendos > 0 && <span className="badge">{adendos === 1 ? tr('1 adendo') : tr('{n} adendos', { n: adendos })}</span>}
                      {souAutor && finalizado && (
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm jornada-fase__adendo pront-no-print"
                          onClick={() => setAberto({ id: prontuario._id, adendo: true })}
                        >
                          <IconeMais />
                          {tr('Adendo')}
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {!loading && (
        <p className="pront-jornada__nota">
          {tr('Aparecem aqui os seus atendimentos e os que outros profissionais liberaram para a sua especialidade.')}
        </p>
      )}

      {faseAberta && (
        <Modal
          title={tr('Atendimento de {data}', { data: formatDataInstanteBR(faseAberta.createdAt) })}
          className="modal--fase"
          persistente={aberto.adendo}
          onClose={() => setAberto(null)}
        >
          <ol className="pront-timeline">
            <EvolucaoItem
              key={faseAberta._id}
              prontuario={faseAberta}
              destaque={!!agendamento && faseAberta.agendamentoId === agendamento._id}
              souAutor={ehDoProfissional(faseAberta, profissional._id)}
              especialidades={especialidades}
              onCompartilhar={onCompartilhar}
              onAdendo={onAdendo}
              abrirAdendo={aberto.adendo}
            />
          </ol>
        </Modal>
      )}
    </aside>
  );
}
