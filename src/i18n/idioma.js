// Idioma do sistema (pt ou en), guardado no navegador. Na primeira visita, segue o idioma do navegador:
// português em qualquer variante vira pt; qualquer outro idioma vira en.
const CHAVE = 'idioma';

function idiomaDoNavegador() {
  const lista = navigator.languages?.length ? navigator.languages : [navigator.language];
  const principal = String(lista.find(Boolean) ?? 'pt').toLowerCase();
  return principal.startsWith('pt') ? 'pt' : 'en';
}

export function lerIdioma() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === 'pt' || salvo === 'en') return salvo;
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
  document.documentElement.lang = idioma === 'en' ? 'en' : 'pt-BR';
}

export const LOCALE = { pt: 'pt-BR', en: 'en-US' };
