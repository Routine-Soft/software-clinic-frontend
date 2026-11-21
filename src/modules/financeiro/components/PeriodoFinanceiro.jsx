import FiltroPeriodo from '@/components/FiltroPeriodo/FiltroPeriodo';
import { IconeSetaDir, IconeSetaEsq } from '@/components/CrudCard/icones';
import { deslocarData, hojeISO, rotuloDoPeriodo } from '../financeiro.utils';
import { tr } from '@/i18n';

// Diário, semanal, mensal ou anual, com setas para ir ao período anterior ou ao seguinte.
export default function PeriodoFinanceiro({ periodo, data, intervalo, onChange }) {
  const hoje = hojeISO();
  const noAtual = intervalo ? hoje >= String(intervalo.inicio).slice(0, 10) && hoje <= String(intervalo.fim).slice(0, 10) : true;

  return (
    <div className="financeiro-periodo">
      <FiltroPeriodo valor={periodo} onChange={(p) => onChange(p, data)} rotulo={tr('Período do financeiro')} />
      <div className="financeiro-periodo__nav">
        <button type="button" className="icon-btn" aria-label={tr('Período anterior')} onClick={() => onChange(periodo, deslocarData(periodo, data, -1))}>
          <IconeSetaEsq />
        </button>
        <span className="financeiro-periodo__rotulo" aria-live="polite">
          {intervalo ? rotuloDoPeriodo(periodo, intervalo.inicio, intervalo.fim) : '…'}
        </span>
        <button type="button" className="icon-btn" aria-label={tr('Próximo período')} onClick={() => onChange(periodo, deslocarData(periodo, data, 1))}>
          <IconeSetaDir />
        </button>
        {!noAtual && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange(periodo, hoje)}>{tr('Voltar para hoje')}</button>
        )}
      </div>
    </div>
  );
}
