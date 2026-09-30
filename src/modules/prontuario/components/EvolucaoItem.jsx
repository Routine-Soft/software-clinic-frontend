import { useState } from 'react';
import { IconeMais } from '@/components/CrudCard/icones';
import { formatDataBR } from '@/utils/date';
import {
  CAMPOS_TEXTO,
  sinaisVitaisEmLista,
  formatDuracao,
  formatDataHoraBR,
} from '../prontuario.utils';

// Atendimento do histórico. Depois de finalizado o texto não muda mais: o autor corrige ou complementa
// com um adendo, que fica registrado com data e autor abaixo do texto original.
export default function EvolucaoItem({ prontuario, destaque = false, souAutor = false, onAdendo }) {
  const [escrevendo, setEscrevendo] = useState(false);
  const [texto, setTexto] = useState('');
  const [salvando, setSalvando] = useState(false);

  const sinais = sinaisVitaisEmLista(prontuario.sinaisVitais);
  const preenchidos = CAMPOS_TEXTO.filter(([campo]) => prontuario[campo]);
  const semConteudo = preenchidos.length === 0 && !prontuario.cid10 && sinais.length === 0 && !prontuario.anexos?.length;
  const finalizado = !!prontuario.atendimentoFinalizadoEm;
  const adendos = prontuario.adendos ?? [];

  async function salvarAdendo(e) {
    e.preventDefault();
    setSalvando(true);
    const salvo = await onAdendo(prontuario._id, texto);
    setSalvando(false);
    if (salvo) {
      setTexto('');
      setEscrevendo(false);
    }
  }

  return (
    <li className={`pront-evolucao${destaque ? ' pront-evolucao--destaque' : ''}`}>
      <span className="pront-evolucao__ponto" aria-hidden="true" />

      <article className="pront-evolucao__corpo">
        <header className="pront-evolucao__topo">
          <div className="pront-evolucao__quando">
            <strong>{formatDataHoraBR(prontuario.createdAt)}</strong>
            <span>{prontuario.profissionalId?.nome ?? 'Profissional removido'}</span>
          </div>

          <div className="pront-evolucao__selos">
            {destaque && <span className="badge badge--success">Desta consulta</span>}
            {!finalizado && <span className="badge badge--live">Em andamento</span>}
            <span className={`badge${prontuario.convenioId?.nome ? ' badge--info' : ''}`}>{prontuario.convenioId?.nome ?? 'Particular'}</span>
            {prontuario.atendimentoIniciadoEm && prontuario.atendimentoFinalizadoEm && (
              <span className="badge">{formatDuracao(prontuario.atendimentoIniciadoEm, prontuario.atendimentoFinalizadoEm)}</span>
            )}
          </div>

          {souAutor && finalizado && !escrevendo && (
            <div className="pront-evolucao__acoes pront-no-print">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEscrevendo(true)}>
                <IconeMais />
                Adendo
              </button>
            </div>
          )}
        </header>

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

          {adendos.length > 0 && (
            <div className="pront-texto">
              <span className="pront-texto__rotulo">Adendos</span>
              <ol className="pront-adendos">
                {adendos.map((adendo) => (
                  <li key={adendo._id} className="pront-adendo">
                    <span className="pront-adendo__meta">
                      {formatDataHoraBR(adendo.criadoEm)} · {adendo.profissionalId?.nome ?? 'Profissional removido'}
                    </span>
                    <p>{adendo.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {escrevendo && (
            <form className="pront-adendo-form pront-no-print" onSubmit={salvarAdendo}>
              <div className="field">
                <label className="field__label" htmlFor={`adendo-${prontuario._id}`}>Novo adendo</label>
                <textarea
                  id={`adendo-${prontuario._id}`}
                  className="input textarea"
                  rows={3}
                  maxLength={5000}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Correção ou complemento deste atendimento"
                  required
                  autoFocus
                />
              </div>
              <p className="pront-trava">O texto original do atendimento não muda. O adendo fica registrado com data e seu nome, e não pode ser apagado.</p>
              <div className="pront-rodape">
                <button type="button" className="btn btn--ghost" onClick={() => { setEscrevendo(false); setTexto(''); }}>Cancelar</button>
                <button type="submit" className={`btn btn--primary${salvando ? ' btn--loading' : ''}`} disabled={salvando || !texto.trim()}>
                  {salvando ? 'Salvando...' : 'Registrar adendo'}
                </button>
              </div>
            </form>
          )}
        </div>
      </article>
    </li>
  );
}
