import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import PacientePicker from '@/modules/paciente/components/PacientePicker';
import { useDadosAgendamento } from '../useDadosAgendamento';
import { formularioDaAgenda, horarioInvalido, montarPayload } from '../agendamento.form';
import AgendamentoCampos from './AgendamentoCampos';
import '../agenda.css';

export default function EditarAgendamentoModal({ agenda, erro, onSave, onClose }) {
  const dados = useDadosAgendamento();
  const [form, setForm] = useState(() => formularioDaAgenda(agenda));
  const [paciente, setPaciente] = useState(agenda.pacienteId);

  return (
    <Modal title="Editar agendamento" wide onClose={onClose}>
      {(fechar) => (
        <div className="modal-form">
          <PacientePicker
            pacientes={dados.pacientes}
            convenios={dados.convenios}
            empresas={dados.empresas}
            valor={paciente}
            onChange={setPaciente}
            onCriarPaciente={dados.criarPaciente}
          />

          <ModalForm
            erro={erro}
            fechar={fechar}
            submitDisabled={!paciente || horarioInvalido(form)}
            onSubmit={() => onSave(agenda._id, montarPayload(form, paciente))}
          >
            <AgendamentoCampos form={form} setForm={setForm} {...dados} />
          </ModalForm>
        </div>
      )}
    </Modal>
  );
}
