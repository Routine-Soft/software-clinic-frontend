import { useState } from 'react';
import { Modal } from '@/components/Modal/Modal';
import { IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { formatDataBR } from '@/utils/date';
import { cancelarAgenda, definirFaltaAgenda, definirRealizadoAgenda } from '../agenda.api';
import { tr } from '@/i18n';

// Janela com os atendimentos que passaram e ninguém confirmou. Cada um pede uma decisão:
// atendido (gera o repasse), não veio ou cancelado.
export default function ConfirmarAtendimentosModal({ pendentes, onMudou, onClose }) {
  const [salvandoId, setSalvandoId] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [erro, setErro] = useState(null);

  async function decidir(agenda, acao) {
    setSalvandoId(agenda._id);
    setErro(null);
    try {
      await acao(agenda._id);
      onMudou();
    } catch (err) {
      setErro(err);
    } finally {
      setSalvandoId(null);
      setCancelandoId(null);
    }
  }

  return (
    <Modal title={tr('Atendimentos sem confirmar')} onClose={onClose} wide persistente>
      <div className="confirmar-janela">
        {pendentes.length === 0 ? (
          <div className="confirmar-janela__vazio">
            <IconeCheck />
            <p>{tr('Tudo confirmado. Nenhum atendimento em aberto.')}</p>
          </div>
        ) : (
          <>
            <p className="confirmar-janela__intro">
              {tr('Estes atendimentos já passaram e ninguém confirmou. Diga o que aconteceu em cada um. O repasse do profissional só é gerado quando você marca "Atendido".')}
            </p>
            {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}
            <ul className="confirmar-janela__lista">
              {pendentes.map((agenda) => {
                const salvando = salvandoId === agenda._id;
                return (
                  <li key={agenda._id} className="confirmar-janela__item">
                    <div className="confirmar-janela__dados">
                      <strong>{formatDataBR(agenda.data)} · {agenda.horaInicio}</strong>
                      <span className="confirmar-janela__paciente">{agenda.pacienteId?.nome ?? tr('Paciente')}</span>
                      <span className="confirmar-janela__sub">
                        {[agenda.profissionalId?.nome, agenda.servicoId?.nome].filter(Boolean).join(' · ')}
                      </span>
                      {agenda.finalizadoEm && <span className="badge badge--info">{tr('Profissional finalizou')}</span>}
                    </div>
                    {cancelandoId === agenda._id ? (
                      <div className="confirmar-acoes">
                        <span className="confirmar-acoes__pergunta">{tr('Cancelar este agendamento?')}</span>
                        <button type="button" className="icon-btn" aria-label={tr('Sim, cancelar')} disabled={salvando} onClick={() => decidir(agenda, cancelarAgenda)}><IconeCheck /></button>
                        <button type="button" className="icon-btn" aria-label={tr('Não cancelar')} disabled={salvando} onClick={() => setCancelandoId(null)}><IconeX /></button>
                      </div>
                    ) : (
                      <div className="confirmar-acoes">
                        <button type="button" className="btn btn--sm confirmar-acoes__atendido" disabled={salvando} onClick={() => decidir(agenda, (id) => definirRealizadoAgenda(id, true))}>
                          <IconeCheck />
                          {salvando ? tr('Salvando...') : tr('Atendido')}
                        </button>
                        <button type="button" className="btn btn--danger btn--sm" disabled={salvando} onClick={() => decidir(agenda, (id) => definirFaltaAgenda(id, true))}>
                          {tr('Não veio')}
                        </button>
                        <button type="button" className="btn btn--ghost btn--sm" disabled={salvando} onClick={() => setCancelandoId(agenda._id)}>
                          {tr('Foi cancelado')}
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      <div className="modal__footer">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          {pendentes.length === 0 ? tr('Fechar') : tr('Decidir depois')}
        </button>
      </div>
    </Modal>
  );
}
