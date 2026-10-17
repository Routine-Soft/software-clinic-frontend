import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { iniciais } from '@/utils/nome';
import { formatDataBR } from '@/utils/date';
import { IconeMais, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { acompanhamentosAtivos, acompanhamentosEncerrados, idsQueAcompanham } from '../paciente.utils';
import { tr } from '@/i18n';

// Quem acompanha o paciente. O profissional entra sozinho na primeira consulta com ele; aqui a recepção inclui
// ou encerra à mão. Encerrar não apaga: fica no histórico, com as datas.
export default function AcompanhamentosModal({ paciente, profissionais, erro, onIncluir, onEncerrar, onClose }) {
  const [atual, setAtual] = useState(paciente);
  const [novoId, setNovoId] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [tentou, setTentou] = useState(false);

  const ativos = acompanhamentosAtivos(atual);
  const encerrados = acompanhamentosEncerrados(atual);
  const ocupados = new Set(idsQueAcompanham(atual));
  const disponiveis = profissionais.filter((p) => !ocupados.has(p._id));

  async function executar(acao) {
    setSalvando(true);
    setTentou(true);
    const atualizado = await acao();
    setSalvando(false);
    if (atualizado) {
      setAtual(atualizado);
      setTentou(false);
    }
    return atualizado;
  }

  async function incluir(e) {
    e.preventDefault();
    if (!novoId) return;
    if (await executar(() => onIncluir(atual._id, novoId))) setNovoId('');
  }

  async function encerrar(acompanhamentoId) {
    setConfirmandoId(null);
    await executar(() => onEncerrar(atual._id, acompanhamentoId));
  }

  return (
    <Modal title={tr('Profissionais que acompanham')} onClose={onClose}>
      {(fechar) => (
        <div className="modal-form acompanhamentos">
          <p className="modal-form__hint">
            {tr('Quem se trata com {nome}. O profissional entra sozinho na primeira consulta e, ao marcar a próxima, já vem sugerido na agenda.', { nome: atual.nome })}
          </p>

          {tentou && !salvando && erro && <p className="alert alert--error" role="alert">{erro.message}</p>}

          {ativos.length === 0 ? (
            <p className="acompanhamentos__vazio">{tr('Nenhum profissional acompanha este paciente ainda.')}</p>
          ) : (
            <ul className="acompanhamentos__lista">
              {ativos.map((a, index) => (
                <li key={a._id} className="acompanhamentos__item" style={{ '--i': index }}>
                  <span className="acompanhamentos__avatar" aria-hidden="true">{iniciais(a.profissionalId.nome)}</span>
                  <span className="acompanhamentos__dados">
                    <strong>{a.profissionalId.nome}</strong>
                    <span>{tr('Desde {data}', { data: formatDataBR(a.desde) })}</span>
                  </span>
                  {confirmandoId === a._id ? (
                    <span className="acompanhamentos__confirmar">
                      <span>{tr('Encerrar?')}</span>
                      <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar: {nome} deixa de acompanhar', { nome: a.profissionalId.nome })} onClick={() => encerrar(a._id)} disabled={salvando}>
                        <IconeCheck />
                      </button>
                      <button type="button" className="icon-btn" aria-label={tr('Manter')} onClick={() => setConfirmandoId(null)}>
                        <IconeX />
                      </button>
                    </span>
                  ) : (
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmandoId(a._id)} disabled={salvando}>
                      {tr('Encerrar')}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form className="acompanhamentos__incluir" onSubmit={incluir}>
            <label className="field__label" htmlFor="acompanhamento-novo">{tr('Incluir profissional')}</label>
            <div className="acompanhamentos__incluir-linha">
              <select id="acompanhamento-novo" className="input" value={novoId} onChange={(e) => setNovoId(e.target.value)} disabled={disponiveis.length === 0}>
                <option value="">{disponiveis.length === 0 ? tr('Todos os profissionais já acompanham') : tr('Escolha o profissional')}</option>
                {disponiveis.map((p) => <option key={p._id} value={p._id}>{p.nome}</option>)}
              </select>
              <button type="submit" className={`btn btn--primary${salvando ? ' btn--loading' : ''}`} disabled={!novoId || salvando}>
                <IconeMais />
                {tr('Incluir')}
              </button>
            </div>
          </form>

          {encerrados.length > 0 && (
            <details className="acompanhamentos__historico">
              <summary>{tr('Histórico ({n})', { n: encerrados.length })}</summary>
              <ul>
                {encerrados.map((a) => (
                  <li key={a._id}>
                    <strong>{a.profissionalId.nome}</strong>
                    <span>{tr('{desde} a {ate}', { desde: formatDataBR(a.desde), ate: formatDataBR(a.ate) })}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={fechar}>{tr('Fechar')}</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
