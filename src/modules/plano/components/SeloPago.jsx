import { tr } from '@/i18n';

// Selo pequeno com cadeado e o nome do plano que libera o recurso (menu, botões).
export default function SeloPago({ plano = 'Pro' }) {
  return (
    <span className="selo-pago" aria-label={tr('Recurso do plano {plano}', { plano })}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="18" height="11" x="3" y="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {plano}
    </span>
  );
}
