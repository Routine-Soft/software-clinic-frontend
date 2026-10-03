import { ROTULO_MODULO } from '../servico.form';

// Escolha do serviço de uma avaliação: só aparecem os serviços marcados com aquele módulo em "Usado em".
export default function CampoServicoDoModulo({ id, modulo, servicos, value, onChange }) {
  const doModulo = servicos.filter((servico) => servico.modulo === modulo);

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>Serviço (opcional)</label>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} disabled={doModulo.length === 0}>
        <option value="">{doModulo.length === 0 ? 'Nenhum serviço deste tipo' : 'Sem serviço vinculado'}</option>
        {doModulo.map((servico) => (
          <option key={servico._id} value={servico._id}>{servico.nome}</option>
        ))}
      </select>
      {doModulo.length === 0 && (
        <p className="field__hint">
          Para vincular o preço, cadastre o serviço em Serviços → Adicionar → modelo &quot;{ROTULO_MODULO[modulo]}&quot;.
        </p>
      )}
    </div>
  );
}
