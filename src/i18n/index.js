import { lerIdioma, LOCALE } from './idioma';
import { traduzir } from './textos';
import EN from './en';
import ES from './es';

const DICIONARIOS = { en: EN, es: ES };

// Idioma da tela, definido ao carregar a página (trocar de idioma recarrega a página: ver IdiomaProvider).
// Por isso tr() pode ser usado em qualquer lugar, inclusive em listas e constantes dos módulos.
const atual = lerIdioma();

export function idiomaAtual() {
  return atual;
}

export function localeAtual() {
  return LOCALE[atual];
}

// Textos por chave (landing, telas de entrada): t('landing.hero.titulo').
export function t(chave, params) {
  return traduzir(atual, chave, params);
}

// Texto do sistema: o próprio português é a chave. Sem tradução, mostra o português.
// {nome} é trocado pelos parâmetros: tr('Faltam {dias} dias', { dias: 3 }).
export function tr(texto, params) {
  const dicionario = DICIONARIOS[atual];
  let saida = dicionario?.[texto] ?? texto;
  if (import.meta.env.DEV && dicionario && !(texto in dicionario)) avisarFalta(texto);
  // Parte condicional desligada ({cond && texto}) vem como false: some, como no JSX.
  if (params) saida = saida.replace(/\{(\w+)\}/g, (trecho, nome) => (nome in params ? valorDoParametro(params[nome]) : trecho));
  return saida;
}

const faltas = new Set();
function avisarFalta(texto) {
  if (faltas.has(texto)) return;
  faltas.add(texto);
  console.warn(`Sem tradução (${atual}): ${texto}`);
}

function valorDoParametro(valor) {
  return valor === false || valor === null || valor === undefined ? '' : String(valor);
}
