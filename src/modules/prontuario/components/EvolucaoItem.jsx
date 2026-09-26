import { useState } from 'react';
import { IconeLapis, IconeLixeira, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { formatDataBR } from '@/utils/date';
import CamposClinicos from './CamposClinicos';
import {
  CAMPOS_TEXTO,
  camposDoProntuario,
  prepararPayload,
  sinaisVitaisEmLista,
  formatDuracao,
  formatDataHoraBR,
} from '../prontuario.utils';

export default function EvolucaoItem({ prontuario, destaque = false, onEditar, onExcluir }) {
  const [editando, setEditando] = useState(false);
  const [campos, setCampos] = useState(() => camposDoProntuario(prontuario));
  const [salvando, setSalvando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const sinais = sinaisVitaisEmLista(prontuario.sinaisVitais);
  const preenchidos = CAMPOS_TEXTO.filter(([campo]) => prontuario[campo]);
  const semConteudo = preenchidos.length === 0 && !prontuario.cid10 && sinais.length === 0 && !prontuario.anexos?.length;

  function iniciarEdicao() {
    setCampos(camposDoProntuario(prontuario));
    setConfirmando(false);
    setEditando(true);
  }

  async function salvar() {
    setSalvando(true);
    const salvo = await onEditar(prontuario._id, prepararPayload(campos));
    setSalvando(false);
    if (salvo) setEditando(false);
  }

  async function excluir() {
    setConfirmando(false);
    await onExcluir(prontuario._id);
  }

  return (
    <li className={`pront-evolucao${editando ? ' is-editing' : ''}${destaque ? ' pront-evolucao--destaque' : ''}`}>
      <span className="pront-evolucao__ponto" aria-hidden="true" />

      <article className="pront-evolucao__corpo">
        <header className="pront-evolucao__topo">
          <div className="pront-evolucao__quando">
            <strong>{formatDataHoraBR(prontuario.createdAt)}</strong>
            <span>{prontuario.profissionalId?.nome ?? 'Profissional removido'}</span>
          </div>

          <div className="pront-evolucao__selos">
            {destaque && <span className="badge badge--success">Desta consulta</span>}
            <span className={`badge${prontuario.convenioId?.nome ? ' badge--info' : ''}`}>{prontuario.convenioId?.nome ?? 'Particular'}</span>
            {prontuario.atendimentoIniciadoEm && prontuario.atendimentoFinalizadoEm && (
              <span className="badge">{formatDuracao(prontuario.atendimentoIniciadoEm, prontuario.atendimentoFinalizadoEm)}</span>
            )}
          </div>

          {!editando && (
            <div className="pront-evolucao__acoes pront-no-print">
              {confirmando ? (
                <div className="pront-confirmar">
                  <span>Excluir?</span>
                  <button type="button" className="icon-btn icon-btn--danger" aria-label="Confirmar exclusão do atendimento" onClick={excluir}>
                    <IconeCheck />
                  </button>
                  <button type="button" className="icon-btn" aria-label="Cancelar exclusão" onClick={() => setConfirmando(false)}>
                    <IconeX />
                  </button>
                </div>
              ) : (
                <>
                  <button type="button" className="icon-btn" aria-label="Editar atendimento" title="Editar" onClick={iniciarEdicao}>
                    <IconeLapis />
                  </button>
                  <button type="button" className="icon-btn icon-btn--danger" aria-label="Excluir atendimento" title="Excluir" onClick={() => setConfirmando(true)}>
                    <IconeLixeira />
                  </button>
                </>
              )}
            </div>
          )}
        </header>

        {editando ? (
          <div className="pront-evolucao__edicao">
            <CamposClinicos valores={campos} onChange={setCampos} />
            <div className="pront-rodape">
              <button type="button" className="btn btn--ghost" onClick={() => setEditando(false)}>Cancelar</button>
              <button type="button" className={`btn btn--primary${salvando ? ' btn--loading' : ''}`} disabled={salvando} onClick={salvar}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        ) : (
          <div className="pront-evolucao__conteudo">
            {semConteudo && <p className="pront-evolucao__vazio">Atendimento sem anotações registradas.</p>}

            {preenchidos.map(([campo, label]) => (
              <div className="pront-texto" key={campo}>
                <span className="pront-texto__rotulo">{label}</span>
                <p>{prontuario[campo]}</p>
              </div>
            ))}

            {prontuario.cid10 && (
              <div className="pront-texto">
                <span className="pront-texto__rotulo">CID-10</span>
                <p><span className="badge badge--primary">{prontuario.cid10}</span></p>
              </div>
            )}

            {sinais.length > 0 && (
              <div className="pront-texto">
                <span className="pront-texto__rotulo">Sinais vitais</span>
                <ul className="pront-sinais">
                  {sinais.map(([rotulo, valor]) => (
                    <li key={rotulo}><span>{rotulo}</span><strong>{valor}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            {prontuario.anexos?.length > 0 && (
              <div className="pront-texto">
                <span className="pront-texto__rotulo">Anexos</span>
                <ul className="pront-anexos">
                  {prontuario.anexos.map((anexo, i) => (
                    <li key={i}>
                      <a className="link" href={anexo.url} target="_blank" rel="noreferrer">{anexo.nome}</a>
                      <span className="badge">{anexo.tipo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prontuario.proximoRetorno && (
              <p className="pront-retorno">Próximo retorno: <strong>{formatDataBR(prontuario.proximoRetorno)}</strong></p>
            )}
          </div>
        )}
      </article>
    </li>
  );
}
