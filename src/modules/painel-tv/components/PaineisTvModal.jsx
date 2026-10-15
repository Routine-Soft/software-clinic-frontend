import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { IconeCheck, IconeX, IconeLixeira } from '@/components/CrudCard/icones';
import { usePaineisTv } from '../painel-tv.hooks';
import { enderecoDoPainel, visto } from '../painel-tv.utils';
import './painel-tv.css';

// TVs da sala de espera: como abrir o painel na TV, conectar pelo código e desconectar.
export default function PaineisTvModal({ onClose }) {
  const { paineis, loading, erro, sucesso, agora, conectar, desconectar } = usePaineisTv();
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [conectando, setConectando] = useState(false);
  const [confirmandoId, setConfirmandoId] = useState(null);

  async function handleConectar(e) {
    e.preventDefault();
    setConectando(true);
    const ok = await conectar({ codigo, nome });
    setConectando(false);
    if (ok) {
      setCodigo('');
      setNome('');
    }
  }

  return (
    <Modal title="TVs da sala de espera" onClose={onClose}>
      {() => (
        <div className="tvs-modal">
          <ol className="tvs-modal__passos">
            <li>Na TV, abra o navegador e entre em <strong className="tvs-modal__endereco">{enderecoDoPainel()}</strong></li>
            <li>A TV mostra um código de 6 números. Digite aqui embaixo.</li>
            <li>Na TV, aperte <strong>OK</strong> em &quot;Iniciar painel&quot; para ligar o som e a voz.</li>
          </ol>

          {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}
          {sucesso && <p className="alert alert--success" role="status">{sucesso}</p>}

          <form className="tvs-modal__form" onSubmit={handleConectar}>
            <div className="field">
              <label className="field__label" htmlFor="tv-codigo">Código da TV</label>
              <input
                id="tv-codigo"
                className="input tvs-modal__codigo"
                inputMode="numeric"
                autoComplete="off"
                placeholder="000 000"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="tv-nome">Nome (opcional)</label>
              <input id="tv-nome" className="input" placeholder="Ex.: TV da recepção" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={60} />
            </div>
            <button type="submit" className={`btn btn--primary${conectando ? ' btn--loading' : ''}`} disabled={conectando || codigo.length !== 6}>
              {conectando ? 'Conectando...' : 'Conectar TV'}
            </button>
          </form>

          <h3 className="tvs-modal__titulo">TVs conectadas</h3>
          {loading ? (
            <div className="skeleton skeleton--line" style={{ height: 48 }} />
          ) : paineis.length === 0 ? (
            <p className="tvs-modal__vazio">Nenhuma TV conectada ainda.</p>
          ) : (
            <ul className="tvs-modal__lista">
              {paineis.map((p) => (
                <li key={p._id}>
                  <div>
                    <strong>{p.nome}</strong>
                    <span>{visto(p.ultimoAcessoEm, agora)}</span>
                  </div>
                  {confirmandoId === p._id ? (
                    <div className="crud-item__confirmar">
                      <span>Desconectar?</span>
                      <button type="button" className="icon-btn icon-btn--danger" aria-label={`Confirmar: desconectar ${p.nome}`} onClick={() => { setConfirmandoId(null); desconectar(p._id); }}>
                        <IconeCheck />
                      </button>
                      <button type="button" className="icon-btn" aria-label="Cancelar" onClick={() => setConfirmandoId(null)}>
                        <IconeX />
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="icon-btn icon-btn--danger" title="Desconectar" aria-label={`Desconectar ${p.nome}`} onClick={() => setConfirmandoId(p._id)}>
                      <IconeLixeira />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Modal>
  );
}
