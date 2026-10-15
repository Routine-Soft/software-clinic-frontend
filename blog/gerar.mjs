// Gera o blog como páginas HTML de verdade em public/blog/ (o Google indexa cada artigo pelo próprio endereço,
// o que não acontece com as rotas "#/" do sistema), além de public/sitemap.xml, public/robots.txt e o feed RSS.
// Roda sozinho antes do `npm run dev` e do `npm run build`. Para um artigo novo: crie um arquivo em blog/artigos/
// e uma imagem 1200×630 em blog/imagens/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE } from './config.mjs';
import { paginaArtigo, paginaIndice, paginaLegal, sitemap, feed, SIMBOLO_SVG } from './modelo.mjs';
import { TERMOS_CLINICA, PRIVACIDADE, EXCLUSAO_DE_DADOS, VERSAO, EMPRESA, CONTATO } from '../src/pages/Termos/termos.dados.js';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const PUBLICO = path.join(RAIZ, '..', 'public');
const SAIDA = path.join(PUBLICO, 'blog');

// O desenho do "So" é o mesmo do sistema (fonte única: SimboloMarca.jsx).
const simboloJsx = fs.readFileSync(path.join(RAIZ, '..', 'src/components/Marca/SimboloMarca.jsx'), 'utf8');
const simbolo = SIMBOLO_SVG.replace('__SO__', simboloJsx.match(/ d="([^"]+)"/)[1]);

const arquivos = fs.readdirSync(path.join(RAIZ, 'artigos')).filter((f) => f.endsWith('.mjs'));
const artigos = [];
for (const arquivo of arquivos) {
  const { default: artigo } = await import(pathToFileURL(path.join(RAIZ, 'artigos', arquivo)));
  if (artigo.slug !== arquivo.replace(/\.mjs$/, '')) throw new Error(`${arquivo}: o slug precisa ser igual ao nome do arquivo`);
  if (artigo.tituloSeo.length > 65) console.warn(`aviso: título SEO de ${artigo.slug} tem ${artigo.tituloSeo.length} caracteres (ideal: até 60)`);
  if (artigo.descricao.length > 160) console.warn(`aviso: descrição de ${artigo.slug} tem ${artigo.descricao.length} caracteres (ideal: até 155)`);
  if (!fs.existsSync(path.join(RAIZ, 'imagens', artigo.imagem))) throw new Error(`${arquivo}: imagem ${artigo.imagem} não encontrada em blog/imagens/`);
  if (!artigo.rascunho) artigos.push(artigo);
}
artigos.sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));

// Monta tudo numa pasta temporária e troca de uma vez: o `npm run dev` gera o blog sozinho a cada mudança,
// e duas gerações ao mesmo tempo não podem apagar os arquivos uma da outra.
const TEMP = path.join(PUBLICO, `.blog-${process.pid}`);
fs.rmSync(TEMP, { recursive: true, force: true });
fs.mkdirSync(path.join(TEMP, 'fontes'), { recursive: true });
fs.cpSync(path.join(RAIZ, 'imagens'), path.join(TEMP, 'imagens'), { recursive: true });
fs.copyFileSync(path.join(RAIZ, 'blog.css'), path.join(TEMP, 'blog.css'));
fs.copyFileSync(
  path.join(RAIZ, '..', 'node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2'),
  path.join(TEMP, 'fontes', 'dm-serif.woff2'),
);

for (const artigo of artigos) {
  fs.mkdirSync(path.join(TEMP, artigo.slug), { recursive: true });
  // "Leia também": primeiro os do mesmo assunto, depois os mais recentes.
  const outros = artigos
    .filter((a) => a.slug !== artigo.slug)
    .sort((a, b) => Number(b.categoria === artigo.categoria) - Number(a.categoria === artigo.categoria));
  fs.writeFileSync(path.join(TEMP, artigo.slug, 'index.html'), paginaArtigo(artigo, { simbolo, outros }));
}
fs.writeFileSync(path.join(TEMP, 'index.html'), paginaIndice(artigos, { simbolo }));
fs.writeFileSync(path.join(TEMP, 'feed.xml'), feed(artigos));

const ANTIGA = `${TEMP}-antiga`;
if (fs.existsSync(SAIDA)) fs.renameSync(SAIDA, ANTIGA);
fs.renameSync(TEMP, SAIDA);
fs.rmSync(ANTIGA, { recursive: true, force: true });

// Páginas legais em endereço normal (a Meta pede estes três links para publicar o app do WhatsApp).
const PAGINAS_LEGAIS = [
  { slug: 'termos-de-uso', termos: TERMOS_CLINICA },
  { slug: 'privacidade', termos: PRIVACIDADE },
  { slug: 'exclusao-de-dados', termos: EXCLUSAO_DE_DADOS },
];
for (const pagina of PAGINAS_LEGAIS) {
  fs.mkdirSync(path.join(PUBLICO, pagina.slug), { recursive: true });
  fs.writeFileSync(path.join(PUBLICO, pagina.slug, 'index.html'), paginaLegal({ ...pagina, versao: VERSAO, empresa: EMPRESA, contato: CONTATO }, { simbolo }));
}

const hoje = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(PUBLICO, 'sitemap.xml'), sitemap(artigos, hoje));
fs.writeFileSync(path.join(PUBLICO, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`blog: ${artigos.length} ${artigos.length === 1 ? 'artigo gerado' : 'artigos gerados'} em public/blog/`);
