import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { Icone, IconeX } from '@/components/CrudCard/icones';
import LogoSite from './LogoSite';
import { irPara } from './landing.navegacao';
import { SECOES } from './landing.dados';
import './landing.css';

// Cabeçalho fixo do site público, igual na landing e nas outras páginas (ex.: "Seja afiliado").
// Fora da landing, as seções levam de volta a ela e rolam até o ponto escolhido.
export default function CabecalhoSite() {
  const { isAuthenticated } = useAuthContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const naLanding = pathname === '/';

  function navegar(id) {
    setMenuAberto(false);
    if (naLanding) irPara(id);
    else navigate('/', { state: { secao: id } });
  }

  function irAoTopo() {
    if (naLanding) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate('/');
  }

  return (
    <header className="lp-header">
      <div className="lp-container lp-header__linha">
        <button type="button" className="lp-header__marca" onClick={irAoTopo} aria-label={naLanding ? 'Voltar ao topo' : 'Página inicial da Sonelia'}>
          <LogoSite />
        </button>

        <nav className={`lp-nav${menuAberto ? ' is-aberto' : ''}`} aria-label="Menu do site">
          {SECOES.map(([id, rotulo]) => (
            <button key={id} type="button" className="lp-nav__link" onClick={() => navegar(id)}>{rotulo}</button>
          ))}
          <Link
            to="/afiliados"
            className="lp-nav__link lp-nav__link--afiliado"
            aria-current={pathname === '/afiliados' ? 'page' : undefined}
            onClick={() => setMenuAberto(false)}
          >
            Seja afiliado
          </Link>
          <div className="lp-nav__acoes">
            {isAuthenticated ? (
              <Link to="/home" className="btn btn--primary">Acessar o painel</Link>
            ) : (
              <>
                <Link to="/login" state={naLanding ? undefined : { voltarPara: pathname }} className="btn btn--ghost">Entrar</Link>
                <Link to="/registro" className="btn btn--primary">Criar conta grátis</Link>
              </>
            )}
          </div>
        </nav>

        <div className="lp-header__direita">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn lp-header__menu"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? <IconeX /> : <Icone><path d="M4 6h16M4 12h16M4 18h16" /></Icone>}
          </button>
        </div>
      </div>
    </header>
  );
}
