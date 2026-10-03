import { useState } from 'react';
import CamposClinicos from './CamposClinicos';
import AcessoAtendimento from './AcessoAtendimento';
import { camposDoProntuario, prepararPayload, formatHoraBR } from '../prontuario.utils';

// Os campos começam do que já está salvo no servidor: quem fechou o prontuário no meio
// do atendimento retoma de onde parou. O `key` no pai recria o componente a cada atendimento.
export default function AtendimentoAtivo({ atendimento, especialidades = [], onCompartilhar, onSalvarRascunho, onFinalizar }) {
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
        <span className="badge badge--live">Em andamento</span>
        <span>
          Atendimento iniciado às <strong>{formatHoraBR(atendimento.atendimentoIniciadoEm)}</strong>
          {atendimento.profissionalId?.nome && <> com <strong>{atendimento.profissionalId.nome}</strong></>}
        </span>
      </div>

      <AcessoAtendimento key={(atendimento.compartilhadoCom ?? []).map((e) => e?._id ?? e).join()} prontuario={atendimento} especialidades={especialidades} souAutor onSalvar={onCompartilhar} />

      <CamposClinicos valores={campos} onChange={setCampos} />

      <div className="pront-rodape pront-rodape--fixo pront-no-print">
        <button
          type="button"
          className={`btn btn--ghost${acao === 'rascunho' ? ' btn--loading' : ''}`}
          disabled={acao !== null}
          onClick={() => executar('rascunho', onSalvarRascunho)}
        >
          {acao === 'rascunho' ? 'Salvando...' : 'Salvar rascunho'}
        </button>
        <button
          type="button"
          className={`btn btn--primary${acao === 'finalizar' ? ' btn--loading' : ''}`}
          disabled={acao !== null}
          onClick={() => executar('finalizar', onFinalizar)}
        >
          {acao === 'finalizar' ? 'Finalizando...' : 'Finalizar atendimento'}
        </button>
      </div>
    </div>
  );
}
