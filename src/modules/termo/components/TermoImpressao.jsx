import { Link, useParams } from 'react-router-dom';
import { useTermo } from '../termo.hooks';
import { situacaoDoTermo } from '../termo.utils';
import TermoDocumento from './TermoDocumento';
import { IconeImpressora, IconeSetaEsquerda } from '@/components/CrudCard/icones';
import '../termo.css';
import { tr } from '@/i18n';

// Termo em página própria (sem o menu), pronto para imprimir ou salvar em PDF.
export default function TermoImpressao() {
  const { id } = useParams();
  const { termo, loading, error } = useTermo(id);
  const situacao = termo ? situacaoDoTermo(termo) : null;

  return (
    <div className="termo-impressao">
      <div className="termo-impressao__barra no-print">
        <Link to="/termos-consentimento" className="btn btn--ghost btn--sm">
          <IconeSetaEsquerda />
          {tr('Voltar')}
        </Link>
        {situacao && <span className={`badge badge--${situacao.tom}`}>{situacao.rotulo}</span>}
        <button type="button" className="btn btn--primary btn--sm" onClick={() => window.print()} disabled={!termo}>
          <IconeImpressora />
          {tr('Imprimir ou salvar em PDF')}
        </button>
      </div>

      <main className="termo-impressao__folha card">
        {loading ? (
          <div aria-busy="true" aria-label={tr('Carregando termo')}>
            <div className="skeleton skeleton--line" style={{ width: '40%' }} />
            <div className="skeleton skeleton--line" style={{ width: '90%' }} />
            <div className="skeleton skeleton--line" style={{ width: '80%' }} />
          </div>
        ) : error ? (
          <p className="alert alert--error" role="alert">{error.message}</p>
        ) : (
          <>
            <p className="termo-impressao__paciente no-print">
              {tr('Paciente:')} <strong>{termo.pacienteId?.nome}</strong>
            </p>
            <TermoDocumento termo={termo} clinica={termo.clinica} />
          </>
        )}
      </main>
    </div>
  );
}
