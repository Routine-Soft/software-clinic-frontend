import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import { getAssinaturaAtual } from '../assinatura.api';
import { avisoDeVencimento } from '../assinatura.utils';
import './aviso-vencimento.css';

// Quem paga a assinatura: o admin e a recepção (que faz o papel de secretaria). Profissional não vê.
// O super_admin também vê a da própria clínica (assim dá para conferir como a barra aparece).
const PAPEIS_QUE_PAGAM = ['admin', 'recepcao', 'super_admin'];

function hojeEmBrasilia() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

// Fechar no "×" esconde a barra até o fim do dia; no dia seguinte ela volta. Guardado só neste navegador.
function chaveDoFechamento(tenantId, proximaCobranca) {
  return `aviso-vencimento:${tenantId}:${proximaCobranca}`;
}

function foiFechadaHoje(chave) {
  try {
    return localStorage.getItem(chave) === hojeEmBrasilia();
  } catch {
    return false;
  }
}

// Barra fina no topo, para quem paga por Pix lembrar de renovar (ou quem está no teste, de assinar) antes do acesso acabar.
export default function AvisoVencimento() {
  const { user } = useAuthContext();
  const { pathname } = useLocation();
  const [assinatura, setAssinatura] = useState(null);
  const [fechada, setFechada] = useState(false);
  const pagaAssinatura = PAPEIS_QUE_PAGAM.includes(user?.role);

  useEffect(() => {
    if (!pagaAssinatura) return undefined;
    let ignore = false;
    getAssinaturaAtual()
      .then(({ data }) => { if (!ignore) setAssinatura(data); })
      .catch(() => {});
    return () => { ignore = true; };
  }, [pagaAssinatura]);

  // Pix pago na tela de assinatura: a barra some na hora, sem recarregar a página.
  useEffect(() => {
    function aoAtualizar(e) {
      if (e.detail) setAssinatura(e.detail);
    }
    window.addEventListener('assinatura:atualizada', aoAtualizar);
    return () => window.removeEventListener('assinatura:atualizada', aoAtualizar);
  }, []);

  const aviso = pagaAssinatura ? avisoDeVencimento(assinatura) : null;
  if (!aviso) return null;

  const chave = chaveDoFechamento(user?.tenantId, assinatura.proximaCobranca);
  if (fechada || foiFechadaHoje(chave)) return null;

  function fechar() {
    try {
      localStorage.setItem(chave, hojeEmBrasilia());
    } catch {
      // Sem armazenamento (navegação privada): fecha só até recarregar a página.
    }
    setFechada(true);
  }

  return (
    <div className="aviso-vencimento" data-tom={aviso.tom} role={aviso.tom === 'danger' ? 'alert' : 'status'}>
      <span className="aviso-vencimento__texto">{aviso.texto}</span>
      {pathname !== '/assinaturas' && (
        <Link to="/assinaturas" className="aviso-vencimento__pagar">{aviso.botao}</Link>
      )}
      <button type="button" className="aviso-vencimento__fechar" aria-label="Fechar aviso até amanhã" title="Fechar até amanhã" onClick={fechar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
