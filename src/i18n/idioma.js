// Idioma do sistema (pt, en ou es), guardado no navegador. Na primeira visita, segue o idioma do navegador:
// português em qualquer variante vira pt; espanhol vira es; qualquer outro idioma vira en.
const CHAVE = 'idioma';

function idiomaDoNavegador() {
  const lista = navigator.languages?.length ? navigator.languages : [navigator.language];
  const principal = String(lista.find(Boolean) ?? 'pt').toLowerCase();
  if (principal.startsWith('pt')) return 'pt';
  return principal.startsWith('es') ? 'es' : 'en';
}

export function lerIdioma() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (IDIOMAS.includes(salvo)) return salvo;
  } catch {
    // armazenamento indisponível
  }
  return idiomaDoNavegador();
}

export function salvarIdioma(idioma, escolhido = false) {
  try {
    // Só guarda quando a pessoa escolhe; enquanto não escolher, continua seguindo o navegador.
    if (escolhido) localStorage.setItem(CHAVE, idioma);
  } catch {
    // armazenamento indisponível: vale só nesta sessão
  }
  document.documentElement.lang = LOCALE[idioma] ?? 'pt-BR';
}

export const IDIOMAS = ['pt', 'en', 'es'];
// Espanhol da América Latina (es-419): datas e números no jeito de lá.
export const LOCALE = { pt: 'pt-BR', en: 'en-US', es: 'es-419' };
