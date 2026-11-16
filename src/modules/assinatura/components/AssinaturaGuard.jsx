import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import { usePlano } from '@/modules/plano/plano.contexto';
import AvisoPlano from '@/modules/plano/components/AvisoPlano';
import './assinatura.css';
import { tr } from '@/i18n';

// Telas que continuam abertas mesmo com o acesso bloqueado, para o cliente conseguir regularizar.
const ROTAS_LIVRES = ['/assinatura', '/assinaturas', '/minha-conta'];

function AcessoBloqueado({ motivo, podePagar }) {
  return (
    <div className="page page--narrow">
      <section className="card assinatura-retorno" data-situacao="bloqueado" role="alert">
        <div className="assinatura-retorno__icone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="11" x="3" y="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="assinatura-retorno__titulo">{tr('Acesso bloqueado')}</h2>
        <p className="assinatura-retorno__texto">{motivo}</p>
        {!podePagar && (
          <p className="assinatura-retorno__texto">{tr('Fale com o administrador da clínica para regularizar a assinatura.')}</p>
        )}

        <div className="assinatura-retorno__acoes">
          {podePagar && <Link to="/assinaturas" className="btn btn--primary">{tr('Regularizar assinatura')}</Link>}
          <Link to="/minha-conta" className="btn btn--ghost">{tr('Minha conta')}</Link>
        </div>
      </section>
    </div>
  );
}

// Sem plano pago valendo, a clínica continua no plano Grátis (os recursos pagos ficam com cadeado, ver AvisoPlano).
// O sistema só fica bloqueado de vez quando o suporte revoga o acesso; o backend barra com 402 nesse caso.
export default function AssinaturaGuard({ children }) {
  const { user } = useAuthContext();
  const { pathname } = useLocation();
  const { bloqueado, motivo } = usePlano();

  const rotaLivre = ROTAS_LIVRES.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`));

  if (bloqueado && !rotaLivre) {
    return <AcessoBloqueado motivo={motivo ?? tr('A assinatura da clínica está inativa.')} podePagar={['admin', 'recepcao'].includes(user?.role)} />;
  }

  return (
    <>
      <AvisoPlano />
      {children}
    </>
  );
}
