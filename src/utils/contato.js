// Contato da Sonelia no site (landing, "Seja afiliado" e blog). O blog/gerar.mjs também lê este arquivo.
export const WHATSAPP = '5521992002356';
export const WHATSAPP_EXIBICAO = '(21) 99200-2356';
// Sem dependências: o blog (Node) também importa este arquivo. No site, a mensagem sai no idioma da tela
// (ver utils/whatsappSite.js).
export const MENSAGEM_WHATSAPP = 'Olá! Vim pelo site da Sonelia e quero saber mais.';

export function linkWhatsapp(mensagem = MENSAGEM_WHATSAPP) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

export const LINK_WHATSAPP = linkWhatsapp();

// Desenho do logo do WhatsApp (um só caminho), usado no botão flutuante e no rodapé.
export const CAMINHO_ICONE_WHATSAPP =
  'M16.04 3C8.86 3 3.02 8.83 3.02 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A13 13 0 0 0 16.04 29C23.2 29 29 23.17 29 16S23.2 3 16.04 3Zm0 23.8c-2 0-3.95-.54-5.65-1.55l-.4-.24-3.97 1.04 1.06-3.86-.26-.4A10.75 10.75 0 0 1 5.24 16c0-5.95 4.85-10.8 10.8-10.8 5.94 0 10.77 4.85 10.77 10.8 0 5.95-4.83 10.8-10.77 10.8Zm5.92-8.08c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.51-.16-.73.16-.21.32-.83 1.06-1.02 1.27-.19.22-.38.24-.7.08-.32-.16-1.37-.5-2.6-1.6-.96-.86-1.6-1.91-1.8-2.23-.19-.32-.02-.5.14-.66.15-.14.32-.38.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.3.32-1.12 1.1-1.12 2.67 0 1.58 1.15 3.1 1.31 3.32.16.21 2.26 3.45 5.47 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.92-.78 2.19-1.54.27-.75.27-1.4.19-1.54-.08-.13-.29-.21-.61-.37Z';
