import { Link } from 'react-router-dom';
import { useModelosAnamnese } from '../anamnese.hooks';
import '@/components/CrudCard/CrudCard.css';
import '../anamnese.css';
import { tr } from '@/i18n';

const IconeAnamnese = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 11h.01M12 11h3M9 15h.01M12 15h3" />
  </svg>
);

// Passo do Painel Admin: mostra os modelos que a clínica já tem (os prontos vêm cadastrados) e leva à tela de Anamneses.
export default function AnamnesesADM({ className = '' }) {
  const { modelos, loading, error } = useModelosAnamnese();

  return (
    <section className={`card crud-card ${className}`.trim()}>
      <header className="crud-card__head">
        <div className="crud-card__icon"><IconeAnamnese /></div>
        <div className="crud-card__titulos">
          <h3 className="crud-card__titulo">{tr('Anamneses')}</h3>
          <p className="crud-card__subtitulo">{tr('Roteiros da primeira consulta')}</p>
        </div>
        {!loading && (
          <span className="badge badge--primary">
            {modelos.length === 1 ? tr('1 modelo') : tr('{n} modelos', { n: modelos.length })}
          </span>
        )}
      </header>

      <p className="alert alert--info anamneses-adm__aviso">
        {tr('Já deixamos alguns modelos pré-cadastrados (Psicologia, Neuropsicologia, Psiquiatria, Fonoaudiologia, Fisioterapia, Clínica Geral e outros). Confira, edite do jeito da sua clínica ou crie os seus.')}
      </p>

      {error && <p className="alert alert--error" role="alert">{error.message}</p>}

      {loading ? (
        <ul className="crud-lista" aria-busy="true" aria-label={tr('Carregando modelos')}>
          {[0, 1, 2].map((i) => (
            <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
              <div className="skeleton crud-item__icone-skeleton" />
              <div className="skeleton skeleton--line" style={{ width: `${60 - i * 10}%` }} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="crud-lista">
          {modelos.map((modelo, index) => (
            <li key={modelo._id} className="crud-item" style={{ '--i': index }}>
              <div className="crud-item__icone"><IconeAnamnese /></div>
              <Link to={`/anamneses/${modelo._id}`} className="crud-item__nome" title={modelo.titulo}>{modelo.titulo}</Link>
            </li>
          ))}
        </ul>
      )}

      <Link to="/anamneses" className="btn btn--ghost btn--sm anamneses-adm__abrir">{tr('Abrir Anamneses')}</Link>
    </section>
  );
}
