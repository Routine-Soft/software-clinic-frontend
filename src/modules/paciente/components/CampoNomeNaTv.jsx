import { useId } from 'react';
import { OPCOES_NOME_NA_TV, nomeParaTv } from '../paciente.utils';

// Escolha de como o paciente aparece na TV da sala de espera, com a prévia do que vai aparecer.
export default function CampoNomeNaTv({ nome, valor, onChange }) {
  const id = useId();
  const previa = nomeParaTv(nome, valor);

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>Nome na TV da sala de espera</label>
      <select id={id} className="input" value={valor} onChange={(e) => onChange(e.target.value)}>
        {OPCOES_NOME_NA_TV.map(([opcao, rotulo]) => (
          <option key={opcao} value={opcao}>{rotulo}</option>
        ))}
      </select>
      <p className="field__hint">
        {valor === 'oculto' ? 'A TV mostra só a sala, sem o nome.' : `Na TV: ${previa ?? 'o nome do paciente'}`}
      </p>
    </div>
  );
}
