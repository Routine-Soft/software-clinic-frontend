import { useState } from 'react';
import { linkDeIndicacao, linkWhatsappTexto } from '../indicacao.utils';
import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import './indicacao.css';

// Cartão com o link de indicação: copiar, enviar pelo WhatsApp e o código para digitar no cadastro.
// Usado no "Indique e ganhe" da clínica e no painel do afiliado; `mensagem(link)` monta o texto do WhatsApp.
export default function CartaoConvite({ codigo, carregando, titulo, texto, mensagem }) {
  const [copiado, setCopiado] = useState(false);
  const link = codigo ? linkDeIndicacao(codigo) : '';

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      document.getElementById('indicacao-link')?.select();
    }
  }

  return (
    <section className="card indicacao-convite">
      <span className="indicacao-convite__icone" aria-hidden="true"><Icone>{ICONES.indicacao}</Icone></span>
      <h3>{titulo}</h3>
      <p>{texto}</p>

      {carregando ? (
        <div className="skeleton skeleton--line" style={{ width: '100%', height: 46 }} />
      ) : codigo && (
        <>
          <div className="indicacao-link">
            <input id="indicacao-link" className="input" type="text" value={link} readOnly aria-label="Seu link de indicação" onFocus={(e) => e.target.select()} />
            <button type="button" className="btn btn--primary" onClick={copiar}>{copiado ? 'Copiado!' : 'Copiar link'}</button>
          </div>
          <div className="indicacao-convite__acoes">
            <a className="btn btn--ghost indicacao-whatsapp" href={linkWhatsappTexto(mensagem(link))} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" /></svg>
              Enviar pelo WhatsApp
            </a>
            <p className="indicacao-codigo">ou passe o código <strong>{codigo}</strong></p>
          </div>
        </>
      )}
    </section>
  );
}
