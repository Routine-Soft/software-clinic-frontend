import { PERIODOS } from './periodos';
import './FiltroPeriodo.css';

// Mesmo visual do seletor Dia/Semana/Mês da agenda. Dentro de um card com --tom, assume a cor dele.
export default function FiltroPeriodo({ valor, onChange, rotulo = 'Período', className = '' }) {
  return (
    <div className={`filtro-periodo ${className}`.trim()} role="group" aria-label={rotulo}>
      {PERIODOS.map(([chave, texto]) => (
        <button
          key={chave}
          type="button"
          className="filtro-periodo__btn"
          aria-pressed={valor === chave}
          onClick={() => onChange(chave)}
        >
          {texto}
        </button>
      ))}
    </div>
  );
}
