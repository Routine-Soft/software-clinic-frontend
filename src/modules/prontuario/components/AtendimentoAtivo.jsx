import { useState } from 'react';
import CamposClinicos from './CamposClinicos';
import { camposDoProntuario, prepararPayload, formatHoraBR } from '../prontuario.utils';
import { tr } from '@/i18n';

// Os campos começam do que já está salvo no servidor: quem fechou o prontuário no meio
// do atendimento retoma de onde parou. O `key` no pai recria o componente a cada atendimento.
// "Quem pode ler" fica no topo do prontuário, junto com o profissional e o convênio.
export default function AtendimentoAtivo({ atendimento, onSalvarRascunho, onFinalizar }) {
  const [campos, setCampos] = useState(() => camposDoProntuario(atendimento));
  const [acao, setAcao] = useState(null);

  async function executar(nome, fn) {
    setAcao(nome);
    await fn(atendimento._id, prepararPayload(campos));
    setAcao(null);
  }

  return (
    <div className="pront-ativo">
      <div className="pront-ativo__banner">
        <span className="badge badge--live">{tr('Em andamento')}</span>
        <span>
          {tr('Atendimento iniciado às')} <strong>{formatHoraBR(atendimento.atendimentoIniciadoEm)}</strong>
          {atendimento.profissionalId?.nome && <> {tr('com')} <strong>{atendimento.profissionalId.nome}</strong></>}
        </span>
      </div>

      <CamposClinicos valores={campos} onChange={setCampos} />

      <div className="pront-rodape pront-rodape--fixo pront-no-print">
        <button
          type="button"
          className={`btn btn--ghost${acao === 'rascunho' ? ' btn--loading' : ''}`}
          disabled={acao !== null}
          onClick={() => executar('rascunho', onSalvarRascunho)}
        >
          {acao === 'rascunho' ? tr('Salvando...') : tr('Salvar rascunho')}
        </button>
        <button
          type="button"
          className={`btn btn--primary${acao === 'finalizar' ? ' btn--loading' : ''}`}
          disabled={acao !== null}
          onClick={() => executar('finalizar', onFinalizar)}
        >
          {acao === 'finalizar' ? tr('Finalizando...') : tr('Finalizar atendimento')}
        </button>
      </div>
    </div>
  );
}
