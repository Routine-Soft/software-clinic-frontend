import { useState } from 'react';
import { IconeX } from '@/components/CrudCard/icones';
import { tr } from '@/i18n';
import './DicaTela.css';

function jaFechada(chave) {
  try {
    return localStorage.getItem(`dica:${chave}`) === 'fechada';
  } catch {
    return false;
  }
}

// Tutorial curto no topo de uma tela. Quem fecha não vê de novo neste navegador.
export default function DicaTela({ chave, titulo, children }) {
  const [fechada, setFechada] = useState(() => jaFechada(chave));

  if (fechada) return null;

  function fechar() {
    try {
      localStorage.setItem(`dica:${chave}`, 'fechada');
    } catch {
      // Sem armazenamento a dica só some até recarregar a página.
    }
    setFechada(true);
  }

  return (
    <aside className="dica-tela" role="note">
      <span className="dica-tela__icone" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
        </svg>
      </span>
      <div className="dica-tela__texto">
        <strong>{titulo}</strong>
        <p>{children}</p>
      </div>
      <button type="button" className="icon-btn dica-tela__fechar" aria-label={tr('Fechar dica')} title={tr('Fechar dica')} onClick={fechar}>
        <IconeX />
      </button>
    </aside>
  );
}
