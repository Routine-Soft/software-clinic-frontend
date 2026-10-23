import comum from './textos/comum';
import landing from '@/pages/Landing/landing.textos';
import auth from '@/modules/user/auth.textos';

// Cada área tem { pt: {...}, en: {...}, es: {...} }. A chave é "area.caminho.do.texto"; {nome} é trocado pelos parâmetros.
// Texto que falta em inglês ou espanhol cai no português (e avisa no console em desenvolvimento).
const TEXTOS = { comum, landing, auth };

function buscar(tabela, caminho) {
  return caminho.reduce((obj, parte) => (obj == null ? undefined : obj[parte]), tabela);
}

export function traduzir(idioma, chave, params) {
  const [area, ...caminho] = chave.split('.');
  let texto = buscar(TEXTOS[area]?.[idioma], caminho) ?? buscar(TEXTOS[area]?.pt, caminho);
  if (texto === undefined) {
    if (import.meta.env.DEV) console.warn(`Texto não encontrado: ${chave}`);
    return chave;
  }
  if (params && typeof texto === 'string') {
    texto = texto.replace(/\{(\w+)\}/g, (trecho, nome) => (nome in params ? String(params[nome]) : trecho));
  }
  return texto;
}
