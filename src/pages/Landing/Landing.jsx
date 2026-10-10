import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { Icone, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import {
  DORES,
  DUVIDAS,
  ESPECIALIDADES,
  FUNCIONALIDADES,
  PASSOS,
  PERFIS,
  PLANO_PRO,
  SECOES,
  SEGURANCA,
  VITRINE,
} from './landing.dados';
import './landing.css';

// O HashRouter usa o "#" da URL para as rotas, então os links do menu rolam até a seção em vez de usar âncoras.
function irPara(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function IconeMenu({ nome }) {
  return <Icone>{ICONES[nome]}</Icone>;
}

function Logo() {
  return (
    <span className="lp-logo">
      <span className="lp-logo__selo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      SoftwareClinic
    </span>
  );
}

// Moldura de navegador em volta das capturas de tela.
function Janela({ src, alt, carregar = 'lazy', className = '' }) {
  return (
    <figure className={`lp-janela ${className}`.trim()}>
      <div className="lp-janela__barra" aria-hidden="true">
        <span /><span /><span />
        <i>softwareclinic</i>
      </div>
      <img src={src} alt={alt} loading={carregar} width="1366" height="820" />
    </figure>
  );
}

function Celular({ src, alt, className = '' }) {
  return (
    <figure className={`lp-celular ${className}`.trim()}>
      <img src={src} alt={alt} loading="lazy" width="390" height="844" />
    </figure>
  );
}

function Cabecalho({ logado }) {
  const [menuAberto, setMenuAberto] = useState(false);

  function navegar(id) {
    setMenuAberto(false);
    irPara(id);
  }

  return (
    <header className="lp-header">
      <div className="lp-container lp-header__linha">
        <button type="button" className="lp-header__marca" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo">
          <Logo />
        </button>

        <nav className={`lp-nav${menuAberto ? ' is-aberto' : ''}`} aria-label="Seções da página">
          {SECOES.map(([id, rotulo]) => (
            <button key={id} type="button" className="lp-nav__link" onClick={() => navegar(id)}>{rotulo}</button>
          ))}
          <div className="lp-nav__acoes">
            {logado ? (
              <Link to="/home" className="btn btn--primary">Acessar o painel</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost">Entrar</Link>
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

function Hero({ logado }) {
  return (
    <section className="lp-hero">
      <div className="lp-container lp-hero__grade">
        <div className="lp-hero__texto">
          <span className="lp-selo">Sistema completo para clínicas</span>
          <h1 className="lp-hero__titulo">
            Sua clínica organizada, <span className="lp-degrade">do agendamento ao repasse.</span>
          </h1>
          <p className="lp-hero__sub">
            Agenda, prontuário eletrônico, pacientes, convênios e repasses dos profissionais em um só lugar.
            Simples para a recepção, seguro para o profissional e claro para a gestão.
          </p>
          <div className="lp-hero__acoes">
            {logado ? (
              <Link to="/home" className="btn btn--primary lp-btn-grande">Acessar o painel</Link>
            ) : (
              <Link to="/registro" className="btn btn--primary lp-btn-grande">Começar teste grátis</Link>
            )}
            <button type="button" className="btn btn--ghost lp-btn-grande" onClick={() => irPara('vitrine')}>Ver o sistema por dentro</button>
          </div>
          <ul className="lp-hero__garantias">
            <li><IconeCheck /> 3 dias grátis</li>
            <li><IconeCheck /> Sem cartão de crédito</li>
            <li><IconeCheck /> Computador e celular</li>
          </ul>
        </div>

        <div className="lp-hero__visual">
          <Janela src="/landing/inicio.jpg" alt="Página inicial do SoftwareClinic com os agendamentos do dia" carregar="eager" />
          <Celular src="/landing/celular-agenda.jpg" alt="Agenda do dia no celular" className="lp-hero__celular" />
          <div className="lp-flutuante lp-flutuante--1" aria-hidden="true">
            <span className="lp-flutuante__ponto" />
            <div><strong>Em atendimento</strong><small>Dra. Helena · 10:30</small></div>
          </div>
          <div className="lp-flutuante lp-flutuante--2" aria-hidden="true">
            <span className="lp-flutuante__icone"><IconeMenu nome="receita" /></span>
            <div><strong>R$ 3.090,00</strong><small>repasses calculados</small></div>
          </div>
        </div>
      </div>

      <div className="lp-container">
        <div className="lp-faixa">
          <span>Feito para</span>
          <ul>
            {ESPECIALIDADES.map((nome) => <li key={nome}>{nome}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Dores() {
  return (
    <section className="lp-secao" id="problemas">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">O dia a dia sem dor de cabeça</span>
          <h2>Reconhece alguma dessas situações?</h2>
          <p>Os problemas mais comuns de quem administra uma clínica, e como o SoftwareClinic resolve cada um.</p>
        </header>

        <ul className="lp-dores">
          {DORES.map((item, i) => (
            <li key={item.dor} className="lp-dor lp-revelar" style={{ '--i': i }}>
              <p className="lp-dor__problema"><IconeX /> {item.dor}</p>
              <div className="lp-dor__solucao">
                <span className="lp-dor__icone"><IconeMenu nome={item.icone} /></span>
                <p>{item.solucao}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Vitrine() {
  const [ativa, setAtiva] = useState(VITRINE[0].chave);
  const tela = VITRINE.find((t) => t.chave === ativa);

  return (
    <section className="lp-secao lp-secao--destaque" id="vitrine">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">Veja por dentro</span>
          <h2>Telas pensadas para quem não é técnico</h2>
          <p>Imagens reais do sistema, com uma clínica de demonstração. Escolha uma área para conhecer.</p>
        </header>

        <div className="lp-abas" role="tablist" aria-label="Áreas do sistema">
          {VITRINE.map((t) => (
            <button
              key={t.chave}
              type="button"
              role="tab"
              id={`aba-${t.chave}`}
              aria-selected={ativa === t.chave}
              aria-controls="painel-vitrine"
              className="lp-aba"
              onClick={() => setAtiva(t.chave)}
            >
              {t.rotulo}
            </button>
          ))}
        </div>

        <div className="lp-vitrine" id="painel-vitrine" role="tabpanel" aria-labelledby={`aba-${tela.chave}`} key={tela.chave}>
          <div className="lp-vitrine__texto">
            <h3>{tela.titulo}</h3>
            <ul className="lp-lista-check">
              {tela.itens.map((item) => <li key={item}><IconeCheck /> {item}</li>)}
            </ul>
          </div>
          <Janela src={tela.imagem} alt={`Tela de ${tela.rotulo} do SoftwareClinic`} className="lp-vitrine__imagem" />
        </div>
      </div>
    </section>
  );
}

function Funcionalidades() {
  return (
    <section className="lp-secao" id="funcionalidades">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">Tudo incluído</span>
          <h2>Tudo o que a sua clínica precisa, sem pagar à parte</h2>
          <p>Todas as funcionalidades fazem parte do mesmo plano.</p>
        </header>

        <ul className="lp-recursos">
          {FUNCIONALIDADES.map((f, i) => (
            <li key={f.titulo} className="lp-recurso lp-revelar" style={{ '--i': i % 4 }}>
              <span className="lp-recurso__icone"><IconeMenu nome={f.icone} /></span>
              <h3>{f.titulo}</h3>
              <p>{f.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Perfis() {
  return (
    <section className="lp-secao lp-secao--destaque" id="para-quem">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">Para quem</span>
          <h2>Cada pessoa da clínica vê o que precisa</h2>
          <p>Gestão, recepção e profissionais usam o mesmo sistema, cada um com o próprio login e o acesso certo.</p>
        </header>

        <ul className="lp-perfis">
          {PERFIS.map((p, i) => (
            <li key={p.papel} className="lp-perfil lp-revelar" style={{ '--i': i }}>
              <span className="lp-perfil__icone"><IconeMenu nome={p.icone} /></span>
              <h3>{p.papel}</h3>
              <p>{p.texto}</p>
              <ul className="lp-lista-check">
                {p.itens.map((item) => <li key={item}><IconeCheck /> {item}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ComoFunciona({ logado }) {
  return (
    <section className="lp-secao" id="como-funciona">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">Como funciona</span>
          <h2>Comece hoje, em três passos</h2>
        </header>

        <ol className="lp-passos">
          {PASSOS.map((passo, i) => (
            <li key={passo.titulo} className="lp-passo lp-revelar" style={{ '--i': i }}>
              <span className="lp-passo__numero">{i + 1}</span>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </li>
          ))}
        </ol>

        {!logado && (
          <div className="lp-centro">
            <Link to="/registro" className="btn btn--primary lp-btn-grande">Criar minha conta grátis</Link>
          </div>
        )}
      </div>
    </section>
  );
}

function EmQualquerLugar() {
  const [tema, setTema] = useState('claro');

  return (
    <section className="lp-secao lp-secao--destaque">
      <div className="lp-container lp-duas-colunas">
        <div className="lp-revelar">
          <span className="lp-selo">No computador e no celular</span>
          <h2>Leve a clínica no bolso</h2>
          <p className="lp-paragrafo">
            O SoftwareClinic se adapta a qualquer tela. A recepção usa no computador, o profissional confere a agenda no
            celular e a gestão acompanha de onde estiver.
          </p>
          <ul className="lp-lista-check">
            <li><IconeCheck /> Instale como aplicativo, com ícone na área de trabalho ou na tela inicial</li>
            <li><IconeCheck /> Atualizações chegam sozinhas, sem baixar nada</li>
            <li><IconeCheck /> Tema claro ou escuro, do jeito que cada um preferir</li>
          </ul>

          <div className="lp-tema" role="group" aria-label="Ver o sistema no tema claro ou escuro">
            <button type="button" aria-pressed={tema === 'claro'} onClick={() => setTema('claro')}>Tema claro</button>
            <button type="button" aria-pressed={tema === 'escuro'} onClick={() => setTema('escuro')}>Tema escuro</button>
          </div>
        </div>

        <div className="lp-dispositivos">
          <Janela
            key={tema}
            src={tema === 'claro' ? '/landing/inicio.jpg' : '/landing/inicio-escuro.jpg'}
            alt={`Página inicial no tema ${tema}`}
            className="lp-dispositivos__janela"
          />
          <Celular src="/landing/celular-agenda.jpg" alt="Agenda no celular" className="lp-dispositivos__celular" />
        </div>
      </div>
    </section>
  );
}

function Seguranca() {
  return (
    <section className="lp-secao">
      <div className="lp-container lp-duas-colunas lp-duas-colunas--invertida">
        <div className="lp-seguranca__selo lp-revelar" aria-hidden="true">
          <IconeMenu nome="nr01" />
        </div>
        <div className="lp-revelar">
          <span className="lp-selo">Segurança e sigilo</span>
          <h2>Dados de saúde tratados com o cuidado que merecem</h2>
          <ul className="lp-lista-check lp-lista-check--grande">
            {SEGURANCA.map((item) => <li key={item}><IconeCheck /> {item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Precos({ logado }) {
  return (
    <section className="lp-secao lp-secao--destaque" id="precos">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">Preços</span>
          <h2>Um plano só, com tudo incluído</h2>
          <p>Teste à vontade antes de decidir.</p>
        </header>

        <div className="lp-planos">
          <article className="lp-plano lp-revelar">
            <h3>Teste grátis</h3>
            <p className="lp-plano__preco">R$ 0<small> por 3 dias</small></p>
            <ul className="lp-lista-check">
              <li><IconeCheck /> Todas as funcionalidades liberadas</li>
              <li><IconeCheck /> Sem cadastrar cartão de crédito</li>
              <li><IconeCheck /> Seus dados continuam ao assinar</li>
            </ul>
            {!logado && <Link to="/registro" className="btn btn--ghost btn--block">Começar teste grátis</Link>}
          </article>

          <article className="lp-plano lp-plano--pro lp-revelar" style={{ '--i': 1 }}>
            <span className="lp-plano__selo">Mais escolhido</span>
            <h3>Pro</h3>
            <p className="lp-plano__preco"><span className="lp-degrade">R$ 200</span><small>/mês</small></p>
            <ul className="lp-lista-check">
              {PLANO_PRO.map((item) => <li key={item}><IconeCheck /> {item}</li>)}
            </ul>
            <Link to={logado ? '/assinaturas' : '/registro'} className="btn btn--primary btn--block">
              {logado ? 'Ver minha assinatura' : 'Criar conta e assinar'}
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function Duvidas() {
  return (
    <section className="lp-secao" id="duvidas">
      <div className="lp-container lp-container--estreito">
        <header className="lp-secao__cab">
          <span className="lp-selo">Dúvidas</span>
          <h2>Perguntas frequentes</h2>
        </header>

        <div className="lp-duvidas">
          {DUVIDAS.map(([pergunta, resposta]) => (
            <details key={pergunta} className="lp-duvida">
              <summary>{pergunta}</summary>
              <p>{resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChamadaFinal({ logado }) {
  return (
    <section className="lp-secao">
      <div className="lp-container">
        <div className="lp-chamada lp-revelar">
          <h2>Pronto para organizar a sua clínica?</h2>
          <p>Crie a conta agora e use tudo liberado por 3 dias, sem cartão.</p>
          <div className="lp-hero__acoes lp-hero__acoes--centro">
            {logado ? (
              <Link to="/home" className="btn lp-btn-claro lp-btn-grande">Acessar o painel</Link>
            ) : (
              <>
                <Link to="/registro" className="btn lp-btn-claro lp-btn-grande">Criar conta grátis</Link>
                <Link to="/login" className="btn lp-btn-contorno lp-btn-grande">Já tenho conta</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Rodape({ logado }) {
  return (
    <footer className="lp-rodape">
      <div className="lp-container lp-rodape__grade">
        <div>
          <Logo />
          <p>Sistema de gestão para clínicas: agenda, prontuário, pacientes, convênios e repasses em um só lugar.</p>
        </div>
        <nav aria-label="Produto">
          <h3>Produto</h3>
          {SECOES.map(([id, rotulo]) => (
            <button key={id} type="button" onClick={() => irPara(id)}>{rotulo}</button>
          ))}
        </nav>
        <nav aria-label="Acesso">
          <h3>Acesso</h3>
          {logado ? (
            <Link to="/home">Acessar o painel</Link>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/registro">Criar conta grátis</Link>
            </>
          )}
        </nav>
      </div>
      <div className="lp-container lp-rodape__base">
        <span>© {new Date().getFullYear()} SoftwareClinic. Feito para clínicas brasileiras.</span>
      </div>
    </footer>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="lp">
      <div className="lp-fundo" aria-hidden="true">
        <span className="lp-fundo__mancha lp-fundo__mancha--1" />
        <span className="lp-fundo__mancha lp-fundo__mancha--2" />
      </div>
      <Cabecalho logado={isAuthenticated} />
      <main>
        <Hero logado={isAuthenticated} />
        <Dores />
        <Vitrine />
        <Funcionalidades />
        <Perfis />
        <ComoFunciona logado={isAuthenticated} />
        <EmQualquerLugar />
        <Seguranca />
        <Precos logado={isAuthenticated} />
        <Duvidas />
        <ChamadaFinal logado={isAuthenticated} />
      </main>
      <Rodape logado={isAuthenticated} />
    </div>
  );
}
