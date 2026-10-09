import './paciente.css';

// Só aparece no cadastro: depois de criado, um paciente real não pode virar teste (nem o contrário).
export default function CampoPacienteTeste({ marcado, onChange }) {
  return (
    <div className="paciente-teste">
      <label className="check">
        <input type="checkbox" checked={marcado} onChange={(e) => onChange(e.target.checked)} />
        Paciente de teste
      </label>
      <span className="paciente-teste__dica">
        Para experimentar o sistema. Pode ser excluído junto com prontuário e agendamentos. Não dá para mudar depois.
      </span>
    </div>
  );
}
