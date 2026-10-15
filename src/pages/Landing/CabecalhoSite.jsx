import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { Icone, IconeX } from '@/components/CrudCard/icones';
import LogoSite from './LogoSite';
import { irPara } from './landing.navegacao';
import { useIdioma } from '@/i18n/useIdioma';
import IdiomaToggle from '@/components/IdiomaToggle/IdiomaToggle';
import './landing.css';

// Cabeçalho fixo do site público, igual na landing e nas outras páginas (ex.: "Seja afiliado").
// Fora da landing, as seções levam de volta a ela e rolam até o ponto escolhido.
// "Dúvidas" fica só no rodapé, para o menu caber numa linha em notebooks.
export default function CabecalhoSite() {
  const { isAuthenticated } = useAuthContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const { t } = useIdioma();
  const M = t('landing.menu');
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
        <button type="button" className="lp-header__marca" onClick={irAoTopo} aria-label={naLanding ? M.voltarTopo : M.paginaInicial}>
          <LogoSite />
        </button>

        <nav className={`lp-nav${menuAberto ? ' is-aberto' : ''}`} aria-label={M.menuDoSite}>
          {t('landing.secoes').filter(([id]) => id !== 'duvidas').map(([id, rotulo]) => (
            <button key={id} type="button" className="lp-nav__link" onClick={() => navegar(id)}>{rotulo}</button>
          ))}
          <a href="/blog/" className="lp-nav__link">{M.blog}</a>
          <Link
            to="/afiliados"
            className="lp-nav__link lp-nav__link--afiliado"
            aria-current={pathname === '/afiliados' ? 'page' : undefined}
            onClick={() => setMenuAberto(false)}
          >
            {M.afiliado}
          </Link>
          {/* No celular, o idioma fica dentro do menu (no topo não cabe junto com o tema). */}
          <div className="lp-nav__idioma"><IdiomaToggle /></div>
          <div className="lp-nav__acoes">
            {isAuthenticated ? (
              <Link to="/home" className="btn btn--primary">{M.painel}</Link>
            ) : (
              <>
                <Link to="/login" state={naLanding ? undefined : { voltarPara: pathname }} className="btn btn--ghost">{M.entrar}</Link>
                <Link to="/registro" className="btn btn--primary">{M.criarConta}</Link>
              </>
            )}
          </div>
        </nav>

        <div className="lp-header__direita">
          <span className="lp-header__idioma"><IdiomaToggle /></span>
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn lp-header__menu"
            aria-label={menuAberto ? M.fecharMenu : M.abrirMenu}
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
