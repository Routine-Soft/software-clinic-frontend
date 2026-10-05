import { useState } from 'react';
import { useUsuariosDaClinica } from '../user.hooks';
import { useAuthContext } from '@/hooks/useAuthContext';
import { ROTULO_FUNCAO, podeAlterarUsuario } from '../user.constants';
import EditarUsuarioModal from './EditarUsuarioModal';
import NovoUsuarioModal from './NovoUsuarioModal';
import { IconeMais } from '@/components/CrudCard/icones';
import { iniciais } from '@/utils/nome';
import './user.css';

export default function UsuariosClinicaADM() {
  const { usuarios, loading, error, successMessage, addUsuario, editUsuario, removeUsuario, resetSenhaUsuario } = useUsuariosDaClinica();
  const { user: usuarioLogado } = useAuthContext();

  const [criandoUsuario, setCriandoUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [redefinindoId, setRedefinindoId] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');

  async function handleSalvarCriacao(dados) {
    return await addUsuario(dados);
  }

  function handleEdit(usuario) {
    setUsuarioEditando(usuario);
  }

  async function handleSalvarEdicao(id, dados) {
    return await editUsuario(id, dados);
  }

  async function handleDelete(id) {
    await removeUsuario(id);
  }

  function iniciarRedefinicao(id) {
    setRedefinindoId(id);
    setNovaSenha('');
  }

  async function handleRedefinirSenha(e, id) {
    e.preventDefault();
    await resetSenhaUsuario(id, novaSenha);
    setRedefinindoId(null);
    setNovaSenha('');
  }

  const algumModalAberto = criandoUsuario || !!usuarioEditando;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Colaboradores da Clínica</h2>
          <p className="page-subtitle">Gerencie quem tem acesso ao sistema e com qual função</p>
        </div>
        <div className="page-header__acoes">
          {!loading && (
            <span className="badge badge--primary">
              {usuarios.length} {usuarios.length === 1 ? 'colaborador' : 'colaboradores'}
            </span>
          )}
          <button type="button" className="btn btn--primary" onClick={() => setCriandoUsuario(true)}>
            <IconeMais />
            Novo colaborador
          </button>
        </div>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      {loading ? (
        <div className="usuarios-grid" aria-busy="true" aria-label="Carregando colaboradores">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card user-card user-card--skeleton" style={{ '--i': i }}>
              <div className="user-card__head">
                <div className="skeleton skeleton--avatar" />
                <div className="user-card__info">
                  <div className="skeleton skeleton--line" style={{ width: '70%' }} />
                  <div className="skeleton skeleton--line" style={{ width: '90%' }} />
                </div>
              </div>
              <div className="skeleton skeleton--line" style={{ width: '45%' }} />
            </div>
          ))}
        </div>
      ) : usuarios.length === 0 ? (
        <p className="usuarios-empty">Nenhum colaborador cadastrado ainda.</p>
      ) : (
        <div className="usuarios-grid">
          {usuarios.map((usuario, index) => (
            <article
              key={usuario._id}
              className={`card user-card${usuarioEditando?._id === usuario._id ? ' user-card--editing' : ''}`}
              style={{ '--i': index }}
            >
              <div className="user-card__head">
                <div className="avatar" data-role={usuario.role} aria-hidden="true">{iniciais(usuario.nomeCompleto)}</div>

                <div className="user-card__info">
                  <p className="user-card__name">
                    {usuario.nomeCompleto}
                    {usuario._id === usuarioLogado?._id && <span className="badge badge--primary badge--live">Você</span>}
                  </p>
                  <p className="user-card__meta" title={usuario.email}>{usuario.email}</p>
                  <p className="user-card__meta">{usuario.telefone}</p>
                </div>
              </div>

              <div>
                <span className={`badge badge--${usuario.role}`}>Função: {ROTULO_FUNCAO[usuario.role] ?? usuario.role}</span>
              </div>

              {podeAlterarUsuario(usuarioLogado, usuario) ? (
                <div className="user-card__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(usuario)}>Editar</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => iniciarRedefinicao(usuario._id)}>Redefinir senha</button>
                  {usuario._id !== usuarioLogado?._id && (
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(usuario._id)}>Excluir</button>
                  )}
                </div>
              ) : (
                <p className="user-card__meta">Só o administrador altera esta conta.</p>
              )}

              {redefinindoId === usuario._id && (
                <form className="user-card__reset" onSubmit={(e) => handleRedefinirSenha(e, usuario._id)}>
                  <div className="field">
                    <label className="field__label" htmlFor={`nova-senha-${usuario._id}`}>Nova senha</label>
                    <input
                      id={`nova-senha-${usuario._id}`}
                      className="input"
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      required
                    />
                  </div>
                  <div className="user-card__reset-actions">
                    <button className="btn btn--primary btn--sm" type="submit">Confirmar</button>
                    <button className="btn btn--ghost btn--sm" type="button" onClick={() => setRedefinindoId(null)}>Cancelar</button>
                  </div>
                </form>
              )}
            </article>
          ))}
        </div>
      )}

      {usuarioEditando && (
        <EditarUsuarioModal
          key={usuarioEditando._id}
          usuario={usuarioEditando}
          erro={error}
          onSave={handleSalvarEdicao}
          onClose={() => setUsuarioEditando(null)}
        />
      )}

      {criandoUsuario && (
        <NovoUsuarioModal
          erro={error}
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoUsuario(false)}
        />
      )}
    </div>
  );
}
