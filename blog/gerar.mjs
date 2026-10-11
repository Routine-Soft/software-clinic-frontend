// Gera o blog como páginas HTML de verdade em public/blog/ (o Google indexa cada artigo pelo próprio endereço,
// o que não acontece com as rotas "#/" do sistema), além de public/sitemap.xml, public/robots.txt e o feed RSS.
// Roda sozinho antes do `npm run dev` e do `npm run build`. Para um artigo novo: crie um arquivo em blog/artigos/
// e uma imagem 1200×630 em blog/imagens/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE } from './config.mjs';
import { paginaArtigo, paginaIndice, sitemap, feed, SIMBOLO_SVG } from './modelo.mjs';

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

fs.rmSync(SAIDA, { recursive: true, force: true });
fs.mkdirSync(path.join(SAIDA, 'fontes'), { recursive: true });
fs.cpSync(path.join(RAIZ, 'imagens'), path.join(SAIDA, 'imagens'), { recursive: true });
fs.copyFileSync(path.join(RAIZ, 'blog.css'), path.join(SAIDA, 'blog.css'));
fs.copyFileSync(
  path.join(RAIZ, '..', 'node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2'),
  path.join(SAIDA, 'fontes', 'dm-serif.woff2'),
);

for (const artigo of artigos) {
  fs.mkdirSync(path.join(SAIDA, artigo.slug), { recursive: true });
  const outros = artigos.filter((a) => a.slug !== artigo.slug);
  fs.writeFileSync(path.join(SAIDA, artigo.slug, 'index.html'), paginaArtigo(artigo, { simbolo, outros }));
}
fs.writeFileSync(path.join(SAIDA, 'index.html'), paginaIndice(artigos, { simbolo }));
fs.writeFileSync(path.join(SAIDA, 'feed.xml'), feed(artigos));

const hoje = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(PUBLICO, 'sitemap.xml'), sitemap(artigos, hoje));
fs.writeFileSync(path.join(PUBLICO, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`blog: ${artigos.length} ${artigos.length === 1 ? 'artigo gerado' : 'artigos gerados'} em public/blog/`);
