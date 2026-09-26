import { useState } from 'react';
import { useProfissionais } from '../profissional.hooks';
import { useEspecialidades } from '@/modules/especialidade/especialidade.hooks';
import { useUsuariosDaClinica } from '@/modules/user/user.hooks';
import EditarProfissionalModal from './EditarProfissionalModal';
import NovoProfissionalModal from './NovoProfissionalModal';
import { Icone, IconeMais, IconeLapis, IconeLixeira, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { iniciais } from '@/utils/nome';
import '@/components/CrudCard/CrudCard.css';

const IconeProfissionais = () => (
  <Icone>
    <path d="M16 10h2M16 14h2M6.17 15a3 3 0 0 1 5.66 0" />
    <circle cx="9" cy="11" r="2" />
    <rect x="2" y="5" width="20" height="14" rx="2" />
  </Icone>
);

export default function ProfissionalADM({ className = '' }) {
  const { profissionais, loading, error, successMessage, addProfissional, editProfissional, removeProfissional } = useProfissionais();
  const { especialidades } = useEspecialidades();
  const { usuarios } = useUsuariosDaClinica();

  const [profissionalEditando, setProfissionalEditando] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [criandoProfissional, setCriandoProfissional] = useState(false);

  const usuariosProfissionais = usuarios.filter((u) => u.role === 'profissional');

  async function handleSalvarCriacao(dados) {
    return await addProfissional(dados);
  }

  function handleEdit(profissional) {
    setConfirmandoId(null);
    setProfissionalEditando(profissional);
  }

  async function handleSalvarEdicao(id, dados) {
    return await editProfissional(id, dados);
  }

  async function handleDelete(id) {
    setConfirmandoId(null);
    await removeProfissional(id);
  }

  const algumModalAberto = criandoProfissional || !!profissionalEditando;

  return (
    <section className={`card crud-card ${className}`.trim()}>
      <header className="crud-card__head">
        <div className="crud-card__icon"><IconeProfissionais /></div>

        <div className="crud-card__titulos">
          <h3 className="crud-card__titulo">Profissionais</h3>
          <p className="crud-card__subtitulo">Equipe de atendimento e seus registros</p>
        </div>

        {!loading && (
          <span className="badge badge--primary">
            {profissionais.length} {profissionais.length === 1 ? 'profissional' : 'profissionais'}
          </span>
        )}
        <button type="button" className="btn btn--primary btn--sm crud-card__novo-btn" onClick={() => setCriandoProfissional(true)} aria-label="Adicionar profissional">
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
        <ul className="crud-lista" aria-busy="true" aria-label="Carregando profissionais">
          {[0, 1, 2].map((i) => (
            <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
              <div className="skeleton crud-item__icone-skeleton" />
              <div className="skeleton skeleton--line" style={{ width: `${60 - i * 10}%` }} />
            </li>
          ))}
        </ul>
      ) : profissionais.length === 0 ? (
        <div className="crud-vazio">
          <IconeProfissionais />
          <p>Nenhum profissional cadastrado ainda.</p>
        </div>
      ) : (
        <ul className="crud-lista">
          {profissionais.map((profissional, index) => {
            const especialidadesDoProfissional = (profissional.especialidadeIds ?? []).map((e) => e.nome ?? e);
            return (
              <li
                key={profissional._id}
                className={`crud-item${profissionalEditando?._id === profissional._id ? ' crud-item--editando' : ''}`}
                style={{ '--i': index }}
              >
                <div className="crud-item__icone crud-item__icone--iniciais" aria-hidden="true">{iniciais(profissional.nome)}</div>

                <div className="crud-item__info">
                  <span className="crud-item__nome" title={profissional.nome}>{profissional.nome}</span>
                  <span className="crud-item__meta">
                    <span className="badge badge--info">{profissional.tipoRegistro} {profissional.numeroRegistro}</span>
                    {especialidadesDoProfissional.map((nome) => (
                      <span key={nome} className="badge badge--primary">{nome}</span>
                    ))}
                  </span>
                  <span className="crud-item__sub" title={profissional.usuarioId?.email}>
                    {profissional.usuarioId?.email ?? 'Sem usuário vinculado'}
                  </span>
                </div>

                {confirmandoId === profissional._id ? (
                  <div className="crud-item__confirmar">
                    <span>Excluir?</span>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Confirmar exclusão de ${profissional.nome}`} onClick={() => handleDelete(profissional._id)}>
                      <IconeCheck />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Cancelar exclusão" onClick={() => setConfirmandoId(null)}>
                      <IconeX />
                    </button>
                  </div>
                ) : (
                  <div className="crud-item__acoes">
                    <button type="button" className="icon-btn" aria-label={`Editar ${profissional.nome}`} title="Editar" onClick={() => handleEdit(profissional)}>
                      <IconeLapis />
                    </button>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Excluir ${profissional.nome}`} title="Excluir" onClick={() => setConfirmandoId(profissional._id)}>
                      <IconeLixeira />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {profissionalEditando && (
        <EditarProfissionalModal
          key={profissionalEditando._id}
          profissional={profissionalEditando}
          especialidades={especialidades}
          usuariosProfissionais={usuariosProfissionais}
          erro={error}
          onSave={handleSalvarEdicao}
          onClose={() => setProfissionalEditando(null)}
        />
      )}

      {criandoProfissional && (
        <NovoProfissionalModal
          especialidades={especialidades}
          usuariosProfissionais={usuariosProfissionais}
          erro={error}
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoProfissional(false)}
        />
      )}
    </section>
  );
}
