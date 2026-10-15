import SimboloMarca from '@/components/Marca/SimboloMarca';
import { tr } from '@/i18n';

// Logo do site público (símbolo + "Sonelia"): cabeçalho e rodapé.
export default function LogoSite() {
  return (
    <span className="lp-logo">
      <span className="lp-logo__selo" aria-hidden="true">
        <SimboloMarca />
      </span>
      {tr('Sonelia')}
    </span>
  );
}
