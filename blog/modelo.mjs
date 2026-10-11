import { SITE, NOME, DESCRICAO_BLOG } from './config.mjs';

export const esc = (t = '') => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export function dataExtenso(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export function minutosDeLeitura(html) {
  const palavras = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

// Aplica o tema salvo pelo sistema (claro, rosa, escuro ou automático) antes de pintar a página.
const SCRIPT_TEMA = `<script>try{var t=localStorage.getItem('theme-preference');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>`;

const SIMBOLO = '<svg viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="__SO__"/></svg>';

function cabecalho(simbolo) {
  return `
<header class="b-topo">
  <div class="b-container b-topo__linha">
    <a class="b-marca" href="/" aria-label="Página inicial da ${NOME}"><span class="b-marca__selo">${simbolo}</span>${NOME}</a>
    <nav class="b-nav" aria-label="Menu do site">
      <a href="/">Início</a>
      <a href="/blog/">Blog</a>
      <a href="/#/afiliados">Seja afiliado</a>
      <a class="b-btn b-btn--ghost" href="/#/login">Entrar</a>
      <a class="b-btn" href="/#/registro">Criar conta grátis</a>
    </nav>
  </div>
</header>`;
}

function rodape(simbolo) {
  return `
<footer class="b-rodape">
  <div class="b-container b-rodape__linha">
    <a class="b-marca" href="/"><span class="b-marca__selo">${simbolo}</span>${NOME}</a>
    <nav aria-label="Links do rodapé">
      <a href="/">Início</a><a href="/blog/">Blog</a><a href="/#/afiliados">Seja afiliado</a><a href="/#/termos">Termos de uso</a>
    </nav>
    <span>© ${new Date().getFullYear()} ${NOME}. Sistema de gestão para clínicas.</span>
  </div>
</footer>`;
}

function head({ titulo, descricao, url, imagem, tipo = 'website', extra = '' }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${NOME}">
<meta property="og:type" content="${tipo}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${imagem}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b1f3a">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="Blog ${NOME}" href="${SITE}/blog/feed.xml">
<link rel="preload" href="/blog/fontes/dm-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/blog/blog.css">
${SCRIPT_TEMA}
${extra}
</head>`;
}

const jsonLd = (dados) => `<script type="application/ld+json">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>`;

function convite(titulo = 'Organize a agenda da sua clínica com a Sonelia') {
  return `
<aside class="b-cta">
  <div>
    <strong>${titulo}</strong>
    <p>Agenda com uma cor por profissional, lista de espera, prontuário eletrônico e repasses automáticos. Teste grátis por 7 dias, sem cartão de crédito.</p>
  </div>
  <a class="b-btn b-btn--grande" href="/#/registro">Testar grátis</a>
</aside>`;
}

export function paginaArtigo(artigo, { simbolo, outros }) {
  const url = `${SITE}/blog/${artigo.slug}/`;
  const imagem = `${SITE}/blog/imagens/${artigo.imagem}`;
  const minutos = minutosDeLeitura(artigo.corpo);
  const secoes = [...artigo.corpo.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map(([, id, texto]) => [id, texto]);

  const dados = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: artigo.titulo,
      description: artigo.descricao,
      image: imagem,
      datePublished: artigo.publicadoEm,
      dateModified: artigo.atualizadoEm,
      inLanguage: 'pt-BR',
      keywords: artigo.palavraChave,
      articleSection: artigo.categoria,
      author: { '@type': 'Organization', name: artigo.autor, url: SITE },
      publisher: { '@type': 'Organization', name: NOME, url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/icons/icon-512.png` } },
      mainEntityOfPage: url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
        { '@type': 'ListItem', position: 3, name: artigo.titulo, item: url },
      ],
    },
  ];
  if (artigo.duvidas?.length) {
    dados.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: artigo.duvidas.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })),
    });
  }

  return `${head({
    // O Google mostra ~60 caracteres: o nome da marca só entra no título quando couber.
    titulo: artigo.tituloSeo.length + NOME.length + 3 <= 62 ? `${artigo.tituloSeo} | ${NOME}` : artigo.tituloSeo,
    descricao: artigo.descricao,
    url,
    imagem,
    tipo: 'article',
    extra: `<meta property="article:published_time" content="${artigo.publicadoEm}">\n<meta property="article:modified_time" content="${artigo.atualizadoEm}">\n${dados.map(jsonLd).join('\n')}`,
  })}
<body>
${cabecalho(simbolo)}
<main class="b-container b-artigo">
  <nav class="b-trilha" aria-label="Você está em"><a href="/">Início</a> › <a href="/blog/">Blog</a> › <span>${esc(artigo.categoria)}</span></nav>
  <article>
    <header class="b-artigo__cab">
      <span class="b-selo">${esc(artigo.categoria)}</span>
      <h1>${esc(artigo.titulo)}</h1>
      <p class="b-artigo__linha-fina">${esc(artigo.descricao)}</p>
      <p class="b-artigo__meta">Por ${esc(artigo.autor)} · <time datetime="${artigo.publicadoEm}">${dataExtenso(artigo.publicadoEm)}</time> · ${minutos} min de leitura</p>
    </header>
    <img class="b-artigo__imagem" src="/blog/imagens/${artigo.imagem}" alt="${esc(artigo.imagemAlt)}" width="1200" height="630" fetchpriority="high">

    <div class="b-artigo__grade">
      <aside class="b-sumario" aria-label="Neste artigo">
        <strong>Neste artigo</strong>
        <ol>${secoes.map(([id, texto]) => `<li><a href="#${id}">${texto}</a></li>`).join('')}</ol>
      </aside>

      <div class="b-texto">
        <section class="b-resumo" aria-label="Resumo">
          <strong>Resumo rápido</strong>
          <ul>${artigo.resumo.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
        </section>
        ${artigo.corpo.replace('{{CTA}}', convite())}

        ${artigo.duvidas?.length ? `<h2 id="duvidas">Perguntas frequentes</h2>
        <div class="b-duvidas">${artigo.duvidas.map(([q, r]) => `<details><summary>${esc(q)}</summary><p>${esc(r)}</p></details>`).join('')}</div>` : ''}

        ${convite('Pronto para ter menos faltas e uma agenda organizada?')}

        ${artigo.fontes?.length ? `<section class="b-fontes"><h2 id="fontes">Fontes</h2><ol>${artigo.fontes.map(([t, u]) => `<li><a href="${u}" rel="noopener" target="_blank">${esc(t)}</a></li>`).join('')}</ol></section>` : ''}

        <p class="b-atualizado">Atualizado em <time datetime="${artigo.atualizadoEm}">${dataExtenso(artigo.atualizadoEm)}</time>.</p>
      </div>
    </div>
  </article>

  ${outros.length ? `<section class="b-mais"><h2>Leia também</h2><div class="b-cartoes">${outros.slice(0, 3).map(cartao).join('')}</div></section>` : ''}
</main>
${rodape(simbolo)}
</body>
</html>`;
}

function cartao(a) {
  return `<a class="b-cartao" href="/blog/${a.slug}/">
  <img src="/blog/imagens/${a.imagem}" alt="" width="1200" height="630" loading="lazy">
  <span class="b-selo">${esc(a.categoria)}</span>
  <strong>${esc(a.titulo)}</strong>
  <span class="b-cartao__resumo">${esc(a.descricao)}</span>
  <span class="b-cartao__meta">${dataExtenso(a.publicadoEm)} · ${minutosDeLeitura(a.corpo)} min de leitura</span>
</a>`;
}

export function paginaIndice(artigos, { simbolo }) {
  const url = `${SITE}/blog/`;
  return `${head({
    titulo: `Blog ${NOME}: gestão de clínicas e consultórios`,
    descricao: DESCRICAO_BLOG,
    url,
    imagem: artigos[0] ? `${SITE}/blog/imagens/${artigos[0].imagem}` : `${SITE}/icons/icon-512.png`,
    extra: jsonLd({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `Blog ${NOME}`,
      description: DESCRICAO_BLOG,
      url,
      inLanguage: 'pt-BR',
      blogPost: artigos.map((a) => ({ '@type': 'BlogPosting', headline: a.titulo, url: `${SITE}/blog/${a.slug}/`, datePublished: a.publicadoEm })),
    }),
  })}
<body>
${cabecalho(simbolo)}
<main class="b-container b-indice">
  <header class="b-indice__cab">
    <span class="b-selo">Blog</span>
    <h1>Gestão de clínicas, sem complicação</h1>
    <p>${DESCRICAO_BLOG}</p>
  </header>
  <div class="b-cartoes">${artigos.map(cartao).join('')}</div>
  ${convite()}
</main>
${rodape(simbolo)}
</body>
</html>`;
}

export function sitemap(artigos, hoje) {
  const urls = [
    [`${SITE}/`, hoje, '1.0'],
    [`${SITE}/blog/`, artigos[0]?.atualizadoEm ?? hoje, '0.8'],
    ...artigos.map((a) => [`${SITE}/blog/${a.slug}/`, a.atualizadoEm, '0.7']),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, mod, pri]) => `  <url><loc>${loc}</loc><lastmod>${mod}</lastmod><priority>${pri}</priority></url>`).join('\n')}
</urlset>
`;
}

export function feed(artigos) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Blog ${NOME}</title><link>${SITE}/blog/</link><description>${esc(DESCRICAO_BLOG)}</description><language>pt-br</language>
${artigos.map((a) => `<item><title>${esc(a.titulo)}</title><link>${SITE}/blog/${a.slug}/</link><guid>${SITE}/blog/${a.slug}/</guid><pubDate>${new Date(`${a.publicadoEm}T09:00:00-03:00`).toUTCString()}</pubDate><description>${esc(a.descricao)}</description></item>`).join('\n')}
</channel></rss>
`;
}

export const SIMBOLO_SVG = SIMBOLO;
