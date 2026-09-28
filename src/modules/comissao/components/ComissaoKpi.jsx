import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';

export default function ComissaoKpi({ icone, tom, rotulo, valor, detalhe, loading }) {
  return (
    <article className="card comissao-kpi" data-tom={tom}>
      <span className="comissao-kpi__icone"><Icone>{ICONES[icone]}</Icone></span>
      <span className="comissao-kpi__rotulo">{rotulo}</span>
      {loading ? <span className="skeleton skeleton--line comissao-kpi__skeleton" /> : <strong className="comissao-kpi__valor">{valor}</strong>}
      {detalhe && <span className="comissao-kpi__detalhe">{detalhe}</span>}
    </article>
  );
}
