import { useState } from 'react';
import { usePacientes } from '@/modules/paciente/paciente.hooks';
import { ordenarPacientes } from '@/modules/paciente/paciente.utils';
import { IconeFicha } from '@/components/CrudCard/icones';
import ProntuarioModal from './ProntuarioModal';

// Tela só para visualizar o modal do prontuário fora da Agenda: escolha um paciente e abra.
export default function ProntuarioModalPreview() {
  const { pacientes, loading } = usePacientes();
  const [pacienteId, setPacienteId] = useState('');
  const [aberto, setAberto] = useState(false);

  const paciente = pacientes.find((p) => p._id === pacienteId);

  return (
    <div className="page page--narrow">
      <header className="page-header">
        <div>
          <h2 className="page-title">Prontuário em modal</h2>
          <p className="page-subtitle">Pré-visualização do modal usado na Agenda</p>
        </div>
      </header>

      <section className="card pront-preview">
        <div className="field">
          <label className="field__label" htmlFor="preview-paciente">Paciente</label>
          <select id="preview-paciente" className="input" value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} disabled={loading}>
            <option value="">{loading ? 'Carregando...' : 'Selecione um paciente'}</option>
            {ordenarPacientes(pacientes).map((p) => (
              <option key={p._id} value={p._id}>{p.nome}</option>
            ))}
          </select>
        </div>

        <button type="button" className="btn btn--primary" disabled={!paciente} onClick={() => setAberto(true)}>
          <IconeFicha />
          Abrir prontuário
        </button>
      </section>

      {aberto && paciente && <ProntuarioModal paciente={paciente} onClose={() => setAberto(false)} />}
    </div>
  );
}
