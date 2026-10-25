// Landing page de uma área de atuação (dados em nichos.mjs). Recursos, segurança e passos vêm da landing
// principal (src/pages/Landing/landing.textos.js), para os textos não ficarem diferentes entre as páginas.
import { SITE, NOME } from './config.mjs';
import { esc, head, cabecalho, rodape, jsonLd, cartao, ICONE_WHATSAPP } from './modelo.mjs';
import { LINK_WHATSAPP } from '../src/utils/contato.js';
import textos from '../src/pages/Landing/landing.textos.js';

const L = textos.pt;

const ICONE_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
const ICONE_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M7 7l10 10M17 7 7 17"/></svg>';
const ICONE_CADEADO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3"/></svg>';

// As capturas de public/landing/ têm 2049×1230.
const janela = (imagem, alt, carregar = 'lazy') => `<figure class="n-janela">
  <div class="n-janela__barra" aria-hidden="true"><i></i><i></i><i></i></div>
  <img src="/landing/${imagem}" alt="${esc(alt)}" width="2049" height="1230" ${carregar === 'eager' ? 'fetchpriority="high"' : 'loading="lazy"'}>
</figure>`;

const lista = (itens) => `<ul class="n-checks">${itens.map((i) => `<li>${ICONE_CHECK}<span>${esc(i)}</span></li>`).join('')}</ul>`;

const cabSecao = (selo, titulo, texto = '') => `<header class="n-cab">
  <span class="b-selo">${esc(selo)}</span>
  <h2>${esc(titulo)}</h2>
  ${texto ? `<p>${esc(texto)}</p>` : ''}
</header>`;

export function paginaNicho(nicho, { simbolo, nichos, artigos }) {
  const url = `${SITE}/${nicho.slug}/`;
  const leituras = nicho.artigos.map((slug) => artigos.find((a) => a.slug === slug)).filter(Boolean);
  const outras = nichos.filter((n) => n.slug !== nicho.slug);

  const dados = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: nicho.tituloSeo,
      description: nicho.descricao,
      url,
      inLanguage: 'pt-BR',
      about: { '@type': 'SoftwareApplication', name: NOME, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: SITE },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: nicho.selo, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: nicho.duvidas.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })),
    },
  ];

  return `${head({
    titulo: nicho.tituloSeo.length + NOME.length + 3 <= 62 ? `${nicho.tituloSeo} | ${NOME}` : nicho.tituloSeo,
    descricao: nicho.descricao,
    url,
    imagem: `${SITE}/landing/${nicho.imagem}`,
    imagemLargura: 2049,
    imagemAltura: 1230,
    estilos: ['/blog/nicho.css'],
    extra: dados.map(jsonLd).join('\n'),
  })}
<body>
${cabecalho(simbolo)}
<main class="n-pagina">
  <section class="n-hero">
    <div class="b-container n-hero__grade">
      <div class="n-hero__texto">
        <nav class="b-trilha" aria-label="Você está em"><a href="/">Início</a> › <span>${esc(nicho.selo)}</span></nav>
        <span class="b-selo">${esc(nicho.selo)}</span>
        <h1>${esc(nicho.titulo)} <span class="n-destaque">${esc(nicho.destaque)}</span></h1>
        <p class="n-hero__sub">${esc(nicho.sub)}</p>
        <div class="n-acoes">
          <a class="b-btn b-btn--grande" href="/#/registro">Começar teste grátis</a>
          <a class="b-btn b-btn--ghost b-btn--grande n-btn-whats" href="${LINK_WHATSAPP}" target="_blank" rel="noopener noreferrer">${ICONE_WHATSAPP} Tirar dúvidas</a>
        </div>
        ${lista(L.hero.garantias).replace('n-checks', 'n-checks n-checks--linha')}
      </div>
      <div class="n-hero__visual">${janela(nicho.imagem, nicho.imagemAlt, 'eager')}</div>
    </div>
  </section>

  <section class="n-secao">
    <div class="b-container">
      ${cabSecao(L.doresCab.selo, L.doresCab.titulo, `Os problemas mais comuns em ${nicho.nome.toLowerCase()}, e como a ${NOME} resolve cada um.`)}
      <ul class="n-dores">
        ${nicho.dores.map(([dor, solucao]) => `<li class="n-cartao n-dor">
          <p class="n-dor__problema">${ICONE_X}<span>${esc(dor)}</span></p>
          <p class="n-dor__solucao">${ICONE_CHECK}<span>${esc(solucao)}</span></p>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="n-secao n-secao--faixa">
    <div class="b-container">
      ${cabSecao('Veja por dentro', 'Telas pensadas para quem não é técnico', 'Imagens reais do sistema, com uma clínica de demonstração e dados fictícios.')}
      <div class="n-destaques">
        ${nicho.destaques.map((d) => `<article class="n-destaque-linha">
          ${janela(d.imagem, d.alt)}
          <div class="n-destaque-linha__texto">
            <h3>${esc(d.titulo)}</h3>
            ${lista(d.itens)}
          </div>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="n-secao">
    <div class="b-container">
      ${cabSecao('Para quem', 'Serve para o seu tipo de atendimento', `A ${NOME} funciona para quem atende sozinho e para clínicas com equipe.`)}
      <ul class="n-chips">${nicho.ideal.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>
  </section>

  <section class="n-secao n-secao--faixa">
    <div class="b-container">
      ${cabSecao(L.funcionalidadesCab.selo, L.funcionalidadesCab.titulo, 'O que vem em cada plano está na página inicial, na seção de preços.')}
      <ul class="n-recursos">
        ${L.funcionalidades.map((f) => `<li class="n-cartao"><strong>${esc(f.titulo)}</strong><span>${esc(f.texto)}</span></li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="n-secao">
    <div class="b-container n-dupla">
      <div class="n-cartao n-seguranca">
        <h2>${ICONE_CADEADO} ${esc(L.segurancaCab.titulo)}</h2>
        ${lista(L.seguranca)}
      </div>
      <div class="n-cartao n-passos">
        <h2>${esc(L.passosCab.titulo)}</h2>
        <ol>${L.passos.map((p) => `<li><strong>${esc(p.titulo)}</strong><span>${esc(p.texto)}</span></li>`).join('')}</ol>
        <a class="b-btn" href="/#/registro">${esc(L.passosCab.criar)}</a>
      </div>
    </div>
  </section>

  <section class="n-secao n-secao--faixa" id="duvidas">
    <div class="b-container n-estreito">
      ${cabSecao(L.duvidasCab.selo, L.duvidasCab.titulo)}
      <div class="b-duvidas">${nicho.duvidas.map(([q, r]) => `<details><summary>${esc(q)}</summary><p>${esc(r)}</p></details>`).join('')}</div>
    </div>
  </section>

  <div class="b-container">
    <aside class="b-cta">
      <div>
        <strong>${esc(nicho.ctaFinal)}</strong>
        <p>${esc(L.chamada.texto)}</p>
      </div>
      <a class="b-btn b-btn--grande" href="/#/registro">${esc(L.chamada.criar)}</a>
    </aside>

    ${leituras.length ? `<section class="b-mais"><h2>Para ler no blog</h2><div class="b-cartoes">${leituras.map(cartao).join('')}</div></section>` : ''}

    <nav class="n-outras" aria-label="Outras áreas">
      <h2>A ${NOME} também é feita para</h2>
      <ul class="n-chips">${outras.map((n) => `<li><a href="/${n.slug}/">${esc(n.selo)}</a></li>`).join('')}<li><a href="/">Ver todas as funcionalidades</a></li></ul>
    </nav>
  </div>
</main>
${rodape(simbolo)}
</body>
</html>`;
}
