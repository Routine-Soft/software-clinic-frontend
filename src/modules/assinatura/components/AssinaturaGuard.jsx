import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import { getAssinaturaAtual } from '../assinatura.api';
import './assinatura.css';

// Telas que continuam abertas mesmo com o acesso bloqueado, para o cliente conseguir regularizar.
const ROTAS_LIVRES = ['/assinatura', '/minha-conta'];

function AcessoBloqueado({ motivo, ehAdmin }) {
  return (
    <div className="page page--narrow">
      <section className="card assinatura-retorno" data-situacao="bloqueado" role="alert">
        <div className="assinatura-retorno__icone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="11" x="3" y="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="assinatura-retorno__titulo">Acesso bloqueado</h2>
        <p className="assinatura-retorno__texto">{motivo}</p>
        {!ehAdmin && (
          <p className="assinatura-retorno__texto">Fale com o administrador da clínica para regularizar a assinatura.</p>
        )}

        <div className="assinatura-retorno__acoes">
          {ehAdmin && <Link to="/assinatura" className="btn btn--primary">Regularizar assinatura</Link>}
          <Link to="/minha-conta" className="btn btn--ghost">Minha conta</Link>
        </div>
      </section>
    </div>
  );
}

// Coloca a tela de "acesso bloqueado" no lugar do sistema quando a assinatura da clínica não dá mais acesso.
// O backend é quem barra de verdade (402 nas rotas); aqui só se evita mostrar telas quebradas.
export default function AssinaturaGuard({ children }) {
  const { user } = useAuthContext();
  const { pathname } = useLocation();
  const [motivoDoBloqueio, setMotivoDoBloqueio] = useState(null);
  const jaVerificou = useRef(false);
  const bloqueado = useRef(false);

  const ehSuperAdmin = user?.role === 'super_admin';

  // Confere no primeiro acesso e, enquanto estiver bloqueado, a cada navegação (o cliente pode ter acabado de pagar).
  useEffect(() => {
    if (ehSuperAdmin || (jaVerificou.current && !bloqueado.current)) return undefined;

    let cancelado = false;

    getAssinaturaAtual()
      .then(({ data }) => {
        if (cancelado) return;
        jaVerificou.current = true;
        const motivo = data.acesso?.liberado === false ? data.acesso.motivo : null;
        bloqueado.current = !!motivo;
        setMotivoDoBloqueio(motivo);
      })
      .catch(() => { jaVerificou.current = true; });

    return () => { cancelado = true; };
  }, [pathname, ehSuperAdmin]);

  // O teste pode vencer com o sistema aberto: qualquer resposta 402 do backend bloqueia na hora.
  useEffect(() => {
    function aoBloquear(e) {
      bloqueado.current = true;
      setMotivoDoBloqueio(e.detail?.motivo ?? 'A assinatura da clínica está inativa.');
    }

    window.addEventListener('assinatura:inativa', aoBloquear);
    return () => window.removeEventListener('assinatura:inativa', aoBloquear);
  }, []);

  const rotaLivre = ROTAS_LIVRES.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`));

  if (motivoDoBloqueio && !ehSuperAdmin && !rotaLivre) {
    return <AcessoBloqueado motivo={motivoDoBloqueio} ehAdmin={user?.role === 'admin'} />;
  }

  return children;
}
