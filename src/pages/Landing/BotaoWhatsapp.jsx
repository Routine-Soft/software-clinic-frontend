import { CAMINHO_ICONE_WHATSAPP } from '@/utils/contato';
import { LINK_WHATSAPP_SITE as LINK_WHATSAPP } from '@/utils/whatsappSite';
import { useIdioma } from '@/i18n/useIdioma';

export function IconeWhatsapp() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="currentColor" d={CAMINHO_ICONE_WHATSAPP} />
    </svg>
  );
}

// Botão flutuante no canto da tela do site público: abre uma conversa no WhatsApp da Sonelia.
export default function BotaoWhatsapp() {
  const { t } = useIdioma();
  return (
    <a className="lp-whats" href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label={t('landing.whatsapp')} title={t('landing.whatsappCurto')}>
      <IconeWhatsapp />
    </a>
  );
}
