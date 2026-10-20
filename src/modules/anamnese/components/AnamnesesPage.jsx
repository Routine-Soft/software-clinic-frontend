import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icone, IconeMais, IconeLapis, IconeLixeira, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { useModelosAnamnese } from '../anamnese.hooks';
import { totalDePerguntas } from '../anamnese.utils';
import '../anamnese.css';
import { tr } from '@/i18n';

export const IconeAnamnese = () => (
  <Icone>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 11h.01M12 11h3M9 15h.01M12 15h3" />
  </Icone>
);

const IconeCopiar = () => (
  <Icone>
    <rect width="13" height="13" x="9" y="9" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Icone>
);

// Modelos de anamnese da clínica: cada profissional escolhe o seu ao preencher a anamnese no prontuário.
export default function AnamnesesPage() {
  const navigate = useNavigate();
  const { modelos, loading, error, successMessage, duplicar, excluir } = useModelosAnamnese();
  const [confirmandoId, setConfirmandoId] = useState(null);

  async function handleDuplicar(id) {
    const copia = await duplicar(id);
    if (copia?._id) navigate(`/anamneses/${copia._id}`);
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Anamneses')}</h2>
          <p className="page-subtitle">{tr('Os modelos da clínica. No prontuário, cada profissional escolhe o seu.')}</p>
        </div>
        <div className="page-header__acoes">
          {!loading && <span className="badge badge--primary">{modelos.length === 1 ? tr('1 modelo') : tr('{n} modelos', { n: modelos.length })}</span>}
          <Link to="/anamneses/novo" className="btn btn--primary">
            <IconeMais />
            {tr('Novo modelo')}
          </Link>
        </div>
      </header>

      {(error || successMessage) && (
        <div className="alerts">
          {error && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      {loading ? (
        <div className="anamneses-grade" aria-busy="true" aria-label={tr('Carregando modelos')}>
          {[0, 1, 2].map((i) => <div key={i} className="card skeleton skeleton--bloco" style={{ minHeight: 170 }} />)}
        </div>
      ) : modelos.length === 0 ? (
        <section className="card crud-vazio">
          <IconeAnamnese />
          <p>{tr('Nenhum modelo de anamnese ainda.')}</p>
          <Link to="/anamneses/novo" className="btn btn--primary btn--sm">{tr('Criar modelo')}</Link>
        </section>
      ) : (
        <div className="anamneses-grade">
          {modelos.map((modelo, index) => (
            <article key={modelo._id} className="card anamnese-modelo" style={{ '--i': Math.min(index, 10) }}>
              <div className="anamnese-modelo__cab">
                <span className="anamnese-modelo__icone" aria-hidden="true"><IconeAnamnese /></span>
                <div>
                  {modelo.area && <span className="anamnese-modelo__area">{modelo.area}</span>}
                  <h3 className="anamnese-modelo__titulo">{modelo.titulo}</h3>
                </div>
              </div>
              <p className="anamnese-modelo__descricao">{modelo.descricao || ' '}</p>
              <div className="anamnese-modelo__rodape">
                <span className="badge">
                  {tr('{secoes} seções · {perguntas} perguntas', { secoes: modelo.secoes.length, perguntas: totalDePerguntas(modelo.secoes) })}
                </span>
                {confirmandoId === modelo._id ? (
                  <span className="anamnese-modelo__acoes">
                    <span>{tr('Excluir?')}</span>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar exclusão de {nome}', { nome: modelo.titulo })} onClick={() => { setConfirmandoId(null); excluir(modelo._id); }}>
                      <IconeCheck />
                    </button>
                    <button type="button" className="icon-btn" aria-label={tr('Cancelar exclusão')} onClick={() => setConfirmandoId(null)}>
                      <IconeX />
                    </button>
                  </span>
                ) : (
                  <span className="anamnese-modelo__acoes">
                    <Link to={`/anamneses/${modelo._id}`} className="icon-btn" title={tr('Editar')} aria-label={tr('Editar {nome}', { nome: modelo.titulo })}>
                      <IconeLapis />
                    </Link>
                    <button type="button" className="icon-btn" title={tr('Duplicar')} aria-label={tr('Duplicar {nome}', { nome: modelo.titulo })} onClick={() => handleDuplicar(modelo._id)}>
                      <IconeCopiar />
                    </button>
                    <button type="button" className="icon-btn icon-btn--danger" title={tr('Excluir')} aria-label={tr('Excluir {nome}', { nome: modelo.titulo })} onClick={() => setConfirmandoId(modelo._id)}>
                      <IconeLixeira />
                    </button>
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="anamneses-nota">
        {tr('Excluir um modelo não apaga as anamneses já preenchidas com ele: cada anamnese guarda a própria cópia das perguntas.')}
      </p>
    </div>
  );
}
