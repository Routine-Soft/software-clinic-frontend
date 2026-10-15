import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { formatDataBR } from '@/utils/date';
import { linkWhatsapp } from '@/utils/whatsapp';
import { IconeCheck, IconeLapis, IconeLixeira, IconeTelefone, IconeX } from '@/components/CrudCard/icones';
import { STATUS_REUNIAO } from '../reuniao.utils';

export default function ReuniaoDetalhesModal({ reuniao, erro, onEditar, onMudarStatus, onExcluir, onClose }) {
  const [rotulo, classe] = STATUS_REUNIAO[reuniao.status] ?? [reuniao.status, ''];
  const [salvando, setSalvando] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const whatsapp = linkWhatsapp(reuniao.telefone);

  async function executar(acao) {
    setSalvando(true);
    setFalhou(false);
    const ok = await acao();
    setSalvando(false);
    if (!ok) setFalhou(true);
  }

  return (
    <Modal title="Reunião" onClose={onClose}>
      <div className="reuniao-detalhes">
        <div className="reuniao-detalhes__cab">
          <div>
            <span className="reuniao-detalhes__rotulo">{formatDataBR(reuniao.data)} · {reuniao.horaInicio} – {reuniao.horaFim}</span>
            <strong className="reuniao-detalhes__nome">{reuniao.nome}</strong>
          </div>
          <span className={`badge ${classe}`}>{rotulo}</span>
        </div>

        {reuniao.telefone && (
          <p className="reuniao-detalhes__linha">
            <IconeTelefone />
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" title="Abrir conversa no WhatsApp">{reuniao.telefone}</a>
            ) : reuniao.telefone}
          </p>
        )}

        {reuniao.observacoes && <p className="reuniao-detalhes__obs">{reuniao.observacoes}</p>}

        {falhou && erro && <p className="alert alert--error" role="alert">{erro.message}</p>}

        <div className="reuniao-detalhes__acoes">
          {reuniao.status === 'aguardando' && (
            <button type="button" className="btn btn--primary btn--sm" disabled={salvando} onClick={() => executar(() => onMudarStatus(reuniao, 'realizado'))}>
              <IconeCheck />
              {salvando ? 'Salvando...' : 'Marcar como realizada'}
            </button>
          )}
          {reuniao.status !== 'aguardando' && (
            <button type="button" className="btn btn--ghost btn--sm" disabled={salvando} onClick={() => executar(() => onMudarStatus(reuniao, 'aguardando'))}>
              {salvando ? 'Salvando...' : 'Reabrir reunião'}
            </button>
          )}
          {reuniao.status !== 'cancelado' && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEditar(reuniao)}>
              <IconeLapis />
              Editar
            </button>
          )}
          {reuniao.status === 'aguardando' && (
            <button type="button" className="btn btn--danger btn--sm" disabled={salvando} onClick={() => executar(() => onMudarStatus(reuniao, 'cancelado'))}>
              Cancelar reunião
            </button>
          )}

          {confirmandoExclusao ? (
            <span className="reuniao-detalhes__confirmar">
              Excluir de vez?
              <button type="button" className="icon-btn icon-btn--danger" aria-label="Confirmar exclusão" disabled={salvando} onClick={() => executar(() => onExcluir(reuniao))}>
                <IconeCheck />
              </button>
              <button type="button" className="icon-btn" aria-label="Não excluir" onClick={() => setConfirmandoExclusao(false)}>
                <IconeX />
              </button>
            </span>
          ) : (
            <button type="button" className="icon-btn icon-btn--danger reuniao-detalhes__excluir" aria-label="Excluir reunião" title="Excluir" onClick={() => setConfirmandoExclusao(true)}>
              <IconeLixeira />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
