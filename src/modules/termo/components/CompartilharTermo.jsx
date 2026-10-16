import { useState } from 'react';
import { linkDoTermo, whatsappDoTermo } from '../termo.utils';
import { IconeAbrirJanela, IconeMensagem, IconeCheck } from '@/components/CrudCard/icones';
import { tr } from '@/i18n';

// Formas de levar o link ao paciente: WhatsApp, copiar (para e-mail, SMS...) ou assinar agora neste aparelho.
export default function CompartilharTermo({ termo, clinica }) {
  const [copiado, setCopiado] = useState(false);
  const link = linkDoTermo(termo.token);
  const whatsapp = whatsappDoTermo(termo, clinica);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="compartilhar-termo">
      <input className="input compartilhar-termo__link" value={link} readOnly aria-label={tr('Link para assinar')} onFocus={(e) => e.target.select()} />
      <div className="compartilhar-termo__botoes">
        {whatsapp ? (
          <a className="btn btn--primary btn--sm" href={whatsapp} target="_blank" rel="noreferrer">
            <IconeMensagem />
            {tr('Mandar no WhatsApp')}
          </a>
        ) : (
          <span className="compartilhar-termo__aviso">{tr('Paciente sem celular cadastrado: copie o link e mande por outro meio.')}</span>
        )}
        <button type="button" className="btn btn--ghost btn--sm" onClick={copiar}>
          {copiado ? <IconeCheck /> : null}
          {copiado ? tr('Link copiado!') : tr('Copiar link')}
        </button>
        <a className="btn btn--ghost btn--sm" href={link} target="_blank" rel="noreferrer">
          <IconeAbrirJanela />
          {tr('Assinar neste aparelho')}
        </a>
      </div>
    </div>
  );
}
