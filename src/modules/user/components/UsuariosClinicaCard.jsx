import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsuariosDaClinica } from '../user.hooks';
import { useAuthContext } from '@/hooks/useAuthContext';
import { ROTULO_FUNCAO, podeAlterarUsuario } from '../user.constants';
import EditarUsuarioModal from './EditarUsuarioModal';
import NovoUsuarioModal from './NovoUsuarioModal';
import { Icone, IconeMais, IconeLapis, IconeLixeira, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { iniciais } from '@/utils/nome';
import EmailQuebravel from '@/components/EmailQuebravel';
import '@/components/CrudCard/CrudCard.css';

const IconeUsuarios = () => (
  <Icone>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Icone>
);

// Versão em cartão da tela de Usuários, para o Painel Admin. A redefinição de senha fica na tela completa.
export default function UsuariosClinicaCard({ className = '' }) {
  const { usuarios, loading, error, successMessage, addUsuario, editUsuario, removeUsuario } = useUsuariosDaClinica();
  const { user: usuarioLogado } = useAuthContext();

  const [criando, setCriando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);

  async function handleDelete(id) {
    setConfirmandoId(null);
    await removeUsuario(id);
  }

  const algumModalAberto = criando || !!editando;

  return (
    <section className={`card crud-card ${className}`.trim()}>
      <header className="crud-card__head">
        <div className="crud-card__icon"><IconeUsuarios /></div>

        <div className="crud-card__titulos">
          <h3 className="crud-card__titulo">Usuários</h3>
          <p className="crud-card__subtitulo">Quem acessa o sistema e com qual função</p>
        </div>

        {!loading && (
          <span className="badge badge--primary">
            {usuarios.length} {usuarios.length === 1 ? 'usuário' : 'usuários'}
          </span>
        )}
        <button type="button" className="btn btn--primary btn--sm crud-card__novo-btn" onClick={() => setCriando(true)} aria-label="Adicionar usuário">
          <IconeMais />
          <span className="crud-card__rotulo">Adicionar</span>
        </button>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts crud-card__alertas">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      {loading ? (
        <ul className="crud-lista" aria-busy="true" aria-label="Carregando usuários">
          {[0, 1, 2].map((i) => (
            <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
              <div className="skeleton crud-item__icone-skeleton" />
              <div className="skeleton skeleton--line" style={{ width: `${60 - i * 10}%` }} />
            </li>
          ))}
        </ul>
      ) : usuarios.length === 0 ? (
        <div className="crud-vazio">
          <IconeUsuarios />
          <p>Nenhum usuário cadastrado ainda.</p>
        </div>
      ) : (
        <ul className="crud-lista">
          {usuarios.map((usuario, index) => {
            const ehVoce = usuario._id === usuarioLogado?._id;
            return (
              <li
                key={usuario._id}
                className={`crud-item${editando?._id === usuario._id ? ' crud-item--editando' : ''}`}
                style={{ '--i': index }}
              >
                <div className="crud-item__icone crud-item__icone--iniciais" aria-hidden="true">{iniciais(usuario.nomeCompleto)}</div>

                <div className="crud-item__info">
                  <span className="crud-item__nome" title={usuario.nomeCompleto}>{usuario.nomeCompleto}</span>
                  <span className="crud-item__sub crud-item__sub--inteiro"><EmailQuebravel email={usuario.email} /></span>
                  {usuario.telefone && <span className="crud-item__sub crud-item__sub--inteiro">{usuario.telefone}</span>}
                  <span className="crud-item__meta">
                    <span className={`badge badge--${usuario.role}`}>{ROTULO_FUNCAO[usuario.role] ?? usuario.role}</span>
                    {ehVoce && <span className="badge badge--primary">Você</span>}
                  </span>
                </div>

                {confirmandoId === usuario._id ? (
                  <div className="crud-item__confirmar">
                    <span>Excluir?</span>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Confirmar exclusão de ${usuario.nomeCompleto}`} onClick={() => handleDelete(usuario._id)}>
                      <IconeCheck />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Cancelar exclusão" onClick={() => setConfirmandoId(null)}>
                      <IconeX />
                    </button>
                  </div>
                ) : podeAlterarUsuario(usuarioLogado, usuario) && (
                  <div className="crud-item__acoes">
                    <button type="button" className="icon-btn" aria-label={`Editar ${usuario.nomeCompleto}`} title="Editar" onClick={() => { setConfirmandoId(null); setEditando(usuario); }}>
                      <IconeLapis />
                    </button>
                    {!ehVoce && (
                      <button type="button" className="icon-btn icon-btn--danger" aria-label={`Excluir ${usuario.nomeCompleto}`} title="Excluir" onClick={() => setConfirmandoId(usuario._id)}>
                        <IconeLixeira />
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="crud-card__dica">
        Para redefinir a senha de alguém, abra a tela <Link to="/usuarios">Usuários</Link>.
      </p>

      {editando && (
        <EditarUsuarioModal key={editando._id} usuario={editando} erro={error} onSave={editUsuario} onClose={() => setEditando(null)} />
      )}

      {criando && (
        <NovoUsuarioModal erro={error} onSave={addUsuario} onClose={() => setCriando(false)} />
      )}
    </section>
  );
}
