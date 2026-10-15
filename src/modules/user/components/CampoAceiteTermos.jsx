import { useIdioma } from '@/i18n/useIdioma';

// Caixa "Li e aceito os termos" dos cadastros (clínica e afiliado). O termo abre numa aba nova
// para a pessoa não perder o que já preencheu.
export default function CampoAceiteTermos({ marcado, onChange, rota, nome }) {
  const { t } = useIdioma();
  return (
    <label className="aceite-termos field--full">
      <input type="checkbox" checked={marcado} onChange={(e) => onChange(e.target.checked)} required />
      <span>
        {t('auth.aceite.liAceito')}{' '}
        <a className="link" href={`/#${rota}`} target="_blank" rel="noreferrer">{nome}</a>
      </span>
    </label>
  );
}
