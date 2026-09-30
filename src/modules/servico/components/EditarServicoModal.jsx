import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import ServicoCampos from './ServicoCampos';
import { formularioDoServico, montarPayloadServico, problemaDoFormulario } from '../servico.form';

export default function EditarServicoModal({ servico, convenios, erro, onSave, onClose }) {
  const [form, setForm] = useState(() => formularioDoServico(servico));
  const problema = problemaDoFormulario(form);

  return (
    <Modal title="Editar serviço" wide onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} submitDisabled={!!problema} onSubmit={() => onSave(servico._id, montarPayloadServico(form))}>
          <ServicoCampos form={form} setForm={setForm} convenios={convenios} />
          {problema && <p className="modal-form__hint modal-form__hint--erro">{problema}</p>}
        </ModalForm>
      )}
    </Modal>
  );
}
