import SimboloMarca from '@/components/Marca/SimboloMarca';

// Logo do site público (símbolo + "Sonelia"): cabeçalho e rodapé.
export default function LogoSite() {
  return (
    <span className="lp-logo">
      <span className="lp-logo__selo" aria-hidden="true">
        <SimboloMarca />
      </span>
      Sonelia
    </span>
  );
}
