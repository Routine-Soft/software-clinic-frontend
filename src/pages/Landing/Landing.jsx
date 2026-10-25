import { usePlanosPublicos } from '@/modules/plano/plano.hooks';
import { recursosExclusivos } from '@/modules/plano/plano.utils';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Icone, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import { useIdioma } from '@/i18n/useIdioma';
import { planoNoIdioma } from '@/modules/plano/plano.utils';
import BotaoWhatsapp, { IconeWhatsapp } from './BotaoWhatsapp';
import { WHATSAPP_EXIBICAO } from '@/utils/contato';
import { LINK_WHATSAPP_SITE as LINK_WHATSAPP } from '@/utils/whatsappSite';
import CabecalhoSite from './CabecalhoSite';
import LogoSite from './LogoSite';
import { irPara } from './landing.navegacao';
import './landing.css';
import { tr } from '@/i18n';

function IconeMenu({ nome }) {
  return <Icone>{ICONES[nome]}</Icone>;
}

// Moldura de navegador em volta das capturas de tela.
function Janela({ src, alt, carregar = 'lazy', className = '' }) {
  return (
    <figure className={`lp-janela ${className}`.trim()}>
      <div className="lp-janela__barra" aria-hidden="true">
        <span /><span /><span />
        <i>sonelia.com.br</i>
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

function Hero({ logado }) {
  const { t } = useIdioma();
  const L = t('landing.hero');
  return (
    <section className="lp-hero">
      <div className="lp-container lp-hero__grade">
        <div className="lp-hero__texto">
          <span className="lp-selo">{L.selo}</span>
          <h1 className="lp-hero__titulo">
            {L.titulo} <span className="lp-degrade">{L.destaque}</span>
          </h1>
          <p className="lp-hero__sub">{L.sub}</p>
          <div className="lp-hero__acoes">
            {logado ? (
              <Link to="/home" className="btn btn--primary lp-btn-grande">{t('landing.menu.painel')}</Link>
            ) : (
              <Link to="/registro" className="btn btn--primary lp-btn-grande">{L.comecar}</Link>
            )}
            <button type="button" className="btn btn--ghost lp-btn-grande" onClick={() => irPara('vitrine')}>{L.verSistema}</button>
          </div>
          <ul className="lp-hero__garantias">
            {L.garantias.map((g) => <li key={g}><IconeCheck /> {g}</li>)}
          </ul>
        </div>

        <div className="lp-hero__visual">
          <Janela src={`${t('landing.imagens')}/inicio.jpg`} alt={L.altInicio} carregar="eager" />
          <Celular src={`${t('landing.imagens')}/celular-agenda.jpg`} alt={L.altCelular} className="lp-hero__celular" />
          <div className="lp-flutuante lp-flutuante--1" aria-hidden="true">
            <span className="lp-flutuante__ponto" />
            <div><strong>{L.emAtendimento}</strong><small>{tr('Dra. Helena · 10:30')}</small></div>
          </div>
          <div className="lp-flutuante lp-flutuante--2" aria-hidden="true">
            <span className="lp-flutuante__icone"><IconeMenu nome="receita" /></span>
            <div><strong>{tr('R$ 3.090,00')}</strong><small>{L.repasses}</small></div>
          </div>
        </div>
      </div>

      <div className="lp-container">
        <div className="lp-faixa">
          <span>{L.feitoPara}</span>
          <ul>
            {t('landing.especialidades').map(([nome, href]) => <li key={nome}>{href ? <a href={href}>{nome}</a> : nome}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Dores() {
  const { t } = useIdioma();
  const cab = t('landing.doresCab');
  return (
    <section className="lp-secao" id="problemas">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">{cab.selo}</span>
          <h2>{cab.titulo}</h2>
          <p>{cab.texto}</p>
        </header>

        <ul className="lp-dores">
          {t('landing.dores').map((item, i) => (
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
  const { t } = useIdioma();
  const cab = t('landing.vitrineCab');
  const vitrine = t('landing.vitrine');
  const [ativa, setAtiva] = useState(vitrine[0].chave);
  const tela = vitrine.find((v) => v.chave === ativa);

  return (
    <section className="lp-secao lp-secao--destaque" id="vitrine">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">{cab.selo}</span>
          <h2>{cab.titulo}</h2>
          <p>{cab.texto}</p>
        </header>

        <div className="lp-abas" role="tablist" aria-label={cab.areas}>
          {vitrine.map((v) => (
            <button
              key={v.chave}
              type="button"
              role="tab"
              id={`aba-${v.chave}`}
              aria-selected={ativa === v.chave}
              aria-controls="painel-vitrine"
              className="lp-aba"
              onClick={() => setAtiva(v.chave)}
            >
              {v.rotulo}
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
          <Janela src={tela.imagem} alt={t('landing.vitrineCab.altTela', { nome: tela.rotulo })} className="lp-vitrine__imagem" />
        </div>
      </div>
    </section>
  );
}

function Funcionalidades() {
  const { t } = useIdioma();
  const cab = t('landing.funcionalidadesCab');
  return (
    <section className="lp-secao" id="funcionalidades">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">{cab.selo}</span>
          <h2>{cab.titulo}</h2>
          <p>{cab.texto}</p>
        </header>

        <ul className="lp-recursos">
          {t('landing.funcionalidades').map((f, i) => (
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
  const { t } = useIdioma();
  const cab = t('landing.perfisCab');
  return (
    <section className="lp-secao lp-secao--destaque" id="para-quem">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">{cab.selo}</span>
          <h2>{cab.titulo}</h2>
          <p>{cab.texto}</p>
        </header>

        <ul className="lp-perfis">
          {t('landing.perfis').map((p, i) => (
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
  const { t } = useIdioma();
  const cab = t('landing.passosCab');
  return (
    <section className="lp-secao" id="como-funciona">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">{cab.selo}</span>
          <h2>{cab.titulo}</h2>
        </header>

        <ol className="lp-passos">
          {t('landing.passos').map((passo, i) => (
            <li key={passo.titulo} className="lp-passo lp-revelar" style={{ '--i': i }}>
              <span className="lp-passo__numero">{i + 1}</span>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </li>
          ))}
        </ol>

        {!logado && (
          <div className="lp-centro">
            <Link to="/registro" className="btn btn--primary lp-btn-grande">{cab.criar}</Link>
          </div>
        )}
      </div>
    </section>
  );
}

function EmQualquerLugar() {
  const { t } = useIdioma();
  const L = t('landing.lugar');
  const [tema, setTema] = useState('claro');

  return (
    <section className="lp-secao lp-secao--destaque">
      <div className="lp-container lp-duas-colunas">
        <div className="lp-revelar">
          <span className="lp-selo">{L.selo}</span>
          <h2>{L.titulo}</h2>
          <p className="lp-paragrafo">{L.texto}</p>
          <ul className="lp-lista-check">
            {L.itens.map((item) => <li key={item}><IconeCheck /> {item}</li>)}
          </ul>

          <div className="lp-tema" role="group" aria-label={L.temaGrupo}>
            <button type="button" aria-pressed={tema === 'claro'} onClick={() => setTema('claro')}>{L.temaClaro}</button>
            <button type="button" aria-pressed={tema === 'escuro'} onClick={() => setTema('escuro')}>{L.temaEscuro}</button>
          </div>
        </div>

        <div className="lp-dispositivos">
          <Janela
            key={tema}
            src={`${t('landing.imagens')}/${tema === 'claro' ? 'inicio' : 'inicio-escuro'}.jpg`}
            alt={t('landing.lugar.altInicio', { tema: tema === 'claro' ? L.claro : L.escuro })}
            className="lp-dispositivos__janela"
          />
          <Celular src={`${t('landing.imagens')}/celular-agenda.jpg`} alt={L.altCelular} className="lp-dispositivos__celular" />
        </div>
      </div>
    </section>
  );
}

function Seguranca() {
  const { t } = useIdioma();
  const cab = t('landing.segurancaCab');
  return (
    <section className="lp-secao">
      <div className="lp-container lp-duas-colunas lp-duas-colunas--invertida">
        <div className="lp-seguranca__selo lp-revelar" aria-hidden="true">
          <IconeMenu nome="nr01" />
        </div>
        <div className="lp-revelar">
          <span className="lp-selo">{cab.selo}</span>
          <h2>{cab.titulo}</h2>
          <ul className="lp-lista-check lp-lista-check--grande">
            {t('landing.seguranca').map((item) => <li key={item}><IconeCheck /> {item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

// Planos do Brasil em reais; os de fora do Brasil em dólar (preço próprio, não convertido).
function formatarPrecoPlano(preco, locale, moeda = 'BRL') {
  const casas = Number.isInteger(Number(preco)) ? 0 : 2;
  return Number(preco).toLocaleString(locale, { style: 'currency', currency: moeda === 'USD' ? 'USD' : 'BRL', minimumFractionDigits: casas, maximumFractionDigits: casas });
}

// Os planos vêm do cadastro de Planos do super admin. O que um plano tem e o outro não aparece em destaque.
function Precos({ logado }) {
  const { t, idioma, locale } = useIdioma();
  const P = t('landing.precos');
  const { planos, carregando, falhou } = usePlanosPublicos();
  const lista = (falhou || (planos && !planos.length) ? t('landing.planosPadrao') : planos ?? []).map((p) => planoNoIdioma(p, idioma));
  const maisCaro = lista.length > 1 ? lista[lista.length - 1]._id : null;

  return (
    <section className="lp-secao lp-secao--destaque" id="precos">
      <div className="lp-container">
        <header className="lp-secao__cab">
          <span className="lp-selo">{P.selo}</span>
          <h2>{P.titulo}</h2>
          <p>{P.texto}</p>
        </header>

        <div className="lp-planos">
          {carregando
            ? [0, 1].map((i) => (
                <article key={i} className="lp-plano" aria-busy="true">
                  <div className="skeleton skeleton--line" style={{ width: '40%', height: 26 }} />
                  <div className="skeleton skeleton--line" style={{ width: '60%', height: 48 }} />
                  <div className="skeleton skeleton--line" style={{ height: 160 }} />
                </article>
              ))
            : lista.map((plano, i) => {
                const exclusivos = recursosExclusivos(plano, lista);
                const destaque = plano._id === maisCaro;
                return (
                  <article key={plano._id} className={`lp-plano lp-revelar${destaque ? ' lp-plano--pro' : ''}`} style={{ '--i': i }}>
                    {destaque && <span className="lp-plano__selo">{P.maisCompleto}</span>}
                    <div className="lp-plano__cab">
                      <h3>{plano.nome}</h3>
                      {plano.descricao && <p className="lp-plano__descricao">{plano.descricao}</p>}
                    </div>
                    <p className="lp-plano__preco"><span className="lp-degrade">{formatarPrecoPlano(plano.preco, locale, plano.moeda)}</span><small>{P.porMes}</small></p>
                    <p className="lp-plano__teste">{P.teste}</p>
                    <ul className="lp-lista-check">
                      {(plano.recursos ?? []).map((item) => (
                        <li key={item} className={exclusivos.has(item) ? 'lp-lista-check__exclusivo' : undefined}>
                          <IconeCheck />
                          <span>
                            {item}
                            {exclusivos.has(item) && <span className="lp-plano__so">{t('landing.precos.soNo', { plano: plano.nome })}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link to={logado ? '/assinaturas' : '/registro'} className={`btn ${destaque ? 'btn--primary' : 'btn--ghost'} btn--block`}>
                      {logado ? P.verAssinatura : P.testar}
                    </Link>
                  </article>
                );
              })}
        </div>
        <p className="lp-planos__nota">{lista[0]?.moeda === 'USD' ? P.notaDolar : P.nota}</p>
      </div>
    </section>
  );
}

function Duvidas() {
  const { t } = useIdioma();
  const cab = t('landing.duvidasCab');
  return (
    <section className="lp-secao" id="duvidas">
      <div className="lp-container lp-container--estreito">
        <header className="lp-secao__cab">
          <span className="lp-selo">{cab.selo}</span>
          <h2>{cab.titulo}</h2>
        </header>

        <div className="lp-duvidas">
          {t('landing.duvidas').map(([pergunta, resposta]) => (
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
  const { t } = useIdioma();
  const C = t('landing.chamada');
  return (
    <section className="lp-secao">
      <div className="lp-container">
        <div className="lp-chamada lp-revelar">
          <h2>{C.titulo}</h2>
          <p>{C.texto}</p>
          <div className="lp-hero__acoes lp-hero__acoes--centro">
            {logado ? (
              <Link to="/home" className="btn lp-btn-claro lp-btn-grande">{t('landing.menu.painel')}</Link>
            ) : (
              <>
                <Link to="/registro" className="btn lp-btn-claro lp-btn-grande">{C.criar}</Link>
                <Link to="/login" className="btn lp-btn-contorno lp-btn-grande">{C.jaTenho}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Rodape({ logado }) {
  const { t } = useIdioma();
  const R = t('landing.rodape');
  const M = t('landing.menu');
  const L = t('landing.hero');
  return (
    <footer className="lp-rodape">
      <div className="lp-container lp-rodape__grade">
        <div>
          <LogoSite />
          <p>{R.descricao}</p>
        </div>
        <nav aria-label={R.produto}>
          <h3>{R.produto}</h3>
          {t('landing.secoes').map(([id, rotulo]) => (
            <button key={id} type="button" onClick={() => irPara(id)}>{rotulo}</button>
          ))}
        </nav>
        <nav aria-label={L.feitoPara}>
          <h3>{L.feitoPara}</h3>
          {t('landing.especialidades').filter(([, href]) => href).map(([nome, href]) => <a key={href} href={href}>{nome}</a>)}
        </nav>
        <nav aria-label={R.acesso}>
          <h3>{R.acesso}</h3>
          {logado ? (
            <Link to="/home">{M.painel}</Link>
          ) : (
            <>
              <Link to="/login">{M.entrar}</Link>
              <Link to="/registro">{M.criarConta}</Link>
            </>
          )}
          <a href="/blog/">{M.blog}</a>
          <Link to="/afiliados">{M.afiliado}</Link>
          <Link to="/termos">{R.termos}</Link>
          <Link to="/privacidade">{R.privacidade}</Link>
        </nav>
        <nav className="lp-rodape__contato" aria-label={R.contato}>
          <h3>{R.contato}</h3>
          <a className="lp-rodape__whats" href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer">
            <IconeWhatsapp /> {WHATSAPP_EXIBICAO}
          </a>
        </nav>
      </div>
      <div className="lp-container lp-rodape__base">
        <span>{tr('© {p0} Sonelia. {base}', { p0: new Date().getFullYear(), base: R.base })}</span>
      </div>
    </footer>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuthContext();
  const secao = useLocation().state?.secao;

  // Veio de outra página pelo menu (ex.: "Preços" na página de afiliados): rola até a seção pedida.
  // Rola de novo um pouco depois: as imagens acima da seção ainda podem estar carregando e empurrar o conteúdo.
  useEffect(() => {
    if (!secao) return undefined;
    const primeira = setTimeout(() => irPara(secao), 100);
    const ajuste = setTimeout(() => irPara(secao), 900);
    return () => {
      clearTimeout(primeira);
      clearTimeout(ajuste);
    };
  }, [secao]);

  return (
    <div className="lp">
      <div className="lp-fundo" aria-hidden="true">
        <span className="lp-fundo__mancha lp-fundo__mancha--1" />
        <span className="lp-fundo__mancha lp-fundo__mancha--2" />
      </div>
      <CabecalhoSite />
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
      <BotaoWhatsapp />
    </div>
  );
}
