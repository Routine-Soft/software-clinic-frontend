// Leitura de planilhas no navegador, sem biblioteca: CSV (qualquer separador, UTF-8 ou Windows-1252, como o Excel
// em português salva) e Excel .xlsx (um .zip com XMLs, aberto com o DecompressionStream do navegador).
// Devolve { cabecalhos: [...], linhas: [{ numero, valores: [...] }] }, com a primeira linha preenchida como cabeçalho.
import { tr } from '@/i18n';

function decodificarTexto(buffer) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder('windows-1252').decode(buffer);
  }
}

function separadorProvavel(primeiraLinha) {
  const contar = (sep) => {
    let total = 0;
    let aspas = false;
    for (const ch of primeiraLinha) {
      if (ch === '"') aspas = !aspas;
      else if (!aspas && ch === sep) total++;
    }
    return total;
  };
  return [';', ',', '\t', '|'].sort((a, b) => contar(b) - contar(a))[0];
}

export function lerCsv(conteudo) {
  const texto = conteudo.replace(/^\uFEFF/, '');
  const sep = separadorProvavel(texto.split(/\r?\n/, 1)[0] ?? '');
  const linhas = [];
  let linha = [];
  let campo = '';
  let aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i];
    if (aspas) {
      if (ch === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (ch === '"') aspas = false;
      else campo += ch;
    } else if (ch === '"' && campo === '') {
      aspas = true;
    } else if (ch === sep) {
      linha.push(campo); campo = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && texto[i + 1] === '\n') i++;
      linha.push(campo); linhas.push(linha); linha = []; campo = '';
    } else {
      campo += ch;
    }
  }
  if (campo !== '' || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

// ---- XLSX ----

async function abrirZip(buffer) {
  const dv = new DataView(buffer);
  let fim = -1;
  for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { fim = i; break; }
  }
  if (fim < 0) throw new Error(tr('Não foi possível abrir a planilha. Salve como .xlsx ou .csv e tente de novo.'));
  const total = dv.getUint16(fim + 10, true);
  let pos = dv.getUint32(fim + 16, true);
  const arquivos = {};
  const nomes = new TextDecoder();
  for (let n = 0; n < total && dv.getUint32(pos, true) === 0x02014b50; n++) {
    const metodo = dv.getUint16(pos + 10, true);
    const tamanho = dv.getUint32(pos + 20, true);
    const lenNome = dv.getUint16(pos + 28, true);
    const lenExtra = dv.getUint16(pos + 30, true);
    const lenComentario = dv.getUint16(pos + 32, true);
    const local = dv.getUint32(pos + 42, true);
    arquivos[nomes.decode(new Uint8Array(buffer, pos + 46, lenNome))] = { metodo, tamanho, local };
    pos += 46 + lenNome + lenExtra + lenComentario;
  }
  return {
    nomes: Object.keys(arquivos),
    async ler(nome) {
      const a = arquivos[nome];
      if (!a) return null;
      const inicio = a.local + 30 + dv.getUint16(a.local + 26, true) + dv.getUint16(a.local + 28, true);
      const dados = new Uint8Array(buffer, inicio, a.tamanho);
      if (a.metodo === 0) return new TextDecoder().decode(dados);
      const fluxo = new Blob([dados]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      return await new Response(fluxo).text();
    },
  };
}

const xml = (texto) => new DOMParser().parseFromString(texto, 'application/xml');
const tags = (no, nome) => Array.from(no.getElementsByTagNameNS('*', nome));

function colunaDaReferencia(ref) {
  let n = 0;
  for (const ch of ref.replace(/\d+/g, '')) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

// Estilos de célula que são data ou hora: o Excel guarda as duas como número.
function estilosDeData(stylesXml) {
  if (!stylesXml) return [];
  const doc = xml(stylesXml);
  const formatos = {};
  for (const f of tags(doc, 'numFmt')) formatos[f.getAttribute('numFmtId')] = f.getAttribute('formatCode') ?? '';
  const xfs = tags(doc, 'cellXfs')[0];
  if (!xfs) return [];
  return tags(xfs, 'xf').map((xf) => {
    const id = Number(xf.getAttribute('numFmtId'));
    const codigo = (formatos[id] ?? '').replace(/"[^"]*"|\[[^\]]*\]/g, '').toLowerCase();
    const ehData = (id >= 14 && id <= 17) || id === 22 || /[dy]/.test(codigo) || (/m/.test(codigo) && !/[hs]/.test(codigo));
    const ehHora = (id >= 18 && id <= 21) || (id >= 45 && id <= 47) || /[hs]/.test(codigo);
    if (ehData) return ehHora || id === 22 ? 'datahora' : 'data';
    return ehHora ? 'hora' : null;
  });
}

function serieParaTexto(serie, tipo) {
  const ms = Math.round((serie - 25569) * 86400000);
  const d = new Date(ms);
  const dois = (n) => String(n).padStart(2, '0');
  const data = `${d.getUTCFullYear()}-${dois(d.getUTCMonth() + 1)}-${dois(d.getUTCDate())}`;
  const hora = `${dois(d.getUTCHours())}:${dois(d.getUTCMinutes())}`;
  if (tipo === 'hora') return hora;
  if (tipo === 'datahora' && hora !== '00:00') return `${data} ${hora}`;
  return data;
}

async function lerXlsx(buffer) {
  const zip = await abrirZip(buffer);
  const planilhas = zip.nomes.filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  if (!planilhas.length) throw new Error(tr('Não foi possível abrir a planilha. Salve como .xlsx ou .csv e tente de novo.'));

  const compartilhados = [];
  const sst = await zip.ler('xl/sharedStrings.xml');
  if (sst) for (const si of tags(xml(sst), 'si')) compartilhados.push(tags(si, 't').map((t) => t.textContent).join(''));
  const estilos = estilosDeData(await zip.ler('xl/styles.xml'));

  const doc = xml(await zip.ler(planilhas[0]));
  const linhas = [];
  for (const row of tags(doc, 'row')) {
    const numero = Number(row.getAttribute('r')) || linhas.length + 1;
    const valores = [];
    for (const c of tags(row, 'c')) {
      const tipo = c.getAttribute('t');
      const v = tags(c, 'v')[0]?.textContent ?? '';
      let valor;
      if (tipo === 's') valor = compartilhados[Number(v)] ?? '';
      else if (tipo === 'inlineStr') valor = tags(c, 't').map((t) => t.textContent).join('');
      else if (tipo === 'b') valor = v === '1' ? 'sim' : 'não';
      else if (tipo === 'str' || tipo === 'e') valor = v;
      else {
        const estilo = estilos[Number(c.getAttribute('s') ?? 0)];
        valor = v !== '' && estilo ? serieParaTexto(Number(v), estilo) : v;
      }
      valores[colunaDaReferencia(c.getAttribute('r') ?? '')] = valor;
    }
    linhas[numero - 1] = Array.from(valores, (x) => x ?? '');
  }
  return Array.from(linhas, (x) => x ?? []);
}

// ---- Entrada ----

export async function lerPlanilha(arquivo) {
  const nome = arquivo.name.toLowerCase();
  const buffer = await arquivo.arrayBuffer();
  let matriz;
  if (nome.endsWith('.xlsx')) matriz = await lerXlsx(buffer);
  else if (nome.endsWith('.xls')) throw new Error(tr('Arquivo .xls antigo: abra no Excel e salve como .xlsx ou .csv.'));
  else matriz = lerCsv(decodificarTexto(buffer));

  const preenchida = (linha) => linha.some((v) => String(v ?? '').trim() !== '');
  const indiceCabecalho = matriz.findIndex(preenchida);
  if (indiceCabecalho < 0) throw new Error(tr('A planilha está vazia.'));
  const cabecalhos = matriz[indiceCabecalho].map((c, i) => String(c ?? '').trim() || tr('Coluna {n}', { n: i + 1 }));
  const linhas = [];
  for (let i = indiceCabecalho + 1; i < matriz.length; i++) {
    if (matriz[i] && preenchida(matriz[i])) linhas.push({ numero: i + 1, valores: matriz[i].map((v) => String(v ?? '').trim()) });
  }
  if (!linhas.length) throw new Error(tr('A planilha só tem o cabeçalho, sem nenhuma linha de dados.'));
  return { cabecalhos, linhas };
}
