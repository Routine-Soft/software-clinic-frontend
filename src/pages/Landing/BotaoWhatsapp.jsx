import { LINK_WHATSAPP, CAMINHO_ICONE_WHATSAPP } from '@/utils/contato';

export function IconeWhatsapp() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="currentColor" d={CAMINHO_ICONE_WHATSAPP} />
    </svg>
  );
}

// Botão flutuante no canto da tela do site público: abre uma conversa no WhatsApp da Sonelia.
export default function BotaoWhatsapp() {
  return (
    <a className="lp-whats" href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Sonelia no WhatsApp" title="Falar no WhatsApp">
      <IconeWhatsapp />
    </a>
  );
}
