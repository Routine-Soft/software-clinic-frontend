import { useIdioma } from '@/i18n/useIdioma';
import './IdiomaToggle.css';
import { tr } from '@/i18n';

const OPCOES = [
  { valor: 'pt', rotulo: 'PT', nome: tr('Português') },
  { valor: 'en', rotulo: 'EN', nome: tr('English') },
];

// Botões PT / EN. A escolha fica guardada no navegador; sem escolha, vale o idioma do navegador.
export default function IdiomaToggle() {
  const { idioma, setIdioma, t } = useIdioma();

  return (
    <div className="idioma-toggle" role="radiogroup" aria-label={t('comum.idioma')}>
      {OPCOES.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={idioma === o.valor}
          aria-label={o.nome}
          title={o.nome}
          className="idioma-toggle__btn"
          onClick={() => idioma !== o.valor && setIdioma(o.valor)}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  );
}
