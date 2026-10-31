import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import PacientePicker from '@/modules/paciente/components/PacientePicker';
import { useDadosAgendamento } from '../useDadosAgendamento';
import { formularioDaAgenda, horarioInvalido, montarPayload } from '../agendamento.form';
import { pagaOPlano } from '../agenda.utils';
import AgendamentoCampos from './AgendamentoCampos';
import FormaPagamentoCampos from './FormaPagamentoCampos';
import '../agenda.css';
import { tr } from '@/i18n';

export default function EditarAgendamentoModal({ agenda, erro, onSave, onClose }) {
  const dados = useDadosAgendamento();
  const [form, setForm] = useState(() => formularioDaAgenda(agenda));
  const [paciente, setPaciente] = useState(agenda.pacienteId);
  const convenio = dados.convenios.find((c) => c._id === form.convenioId);
  const plano = pagaOPlano(convenio) ? convenio : null;

  return (
    <Modal title={tr('Editar agendamento')} wide onClose={onClose}>
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
            onSubmit={() => onSave(agenda._id, montarPayload(form, paciente, !!plano))}
          >
            <AgendamentoCampos form={form} setForm={setForm} paciente={paciente} {...dados} />

            <fieldset className="modal-form__section">
              <legend>{tr('Forma de pagamento')}</legend>
              <FormaPagamentoCampos form={form} setForm={setForm} plano={plano} />
            </fieldset>
          </ModalForm>
        </div>
      )}
    </Modal>
  );
}
