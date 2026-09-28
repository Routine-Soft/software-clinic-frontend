import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

export default function EditarAdminModal({ admin, erro, onSave, onClose }) {
  const [form, setForm] = useState({
    nomeCompleto: admin.nomeCompleto,
    email: admin.email,
    telefone: admin.telefone,
    nomeEmpresa: admin.nomeEmpresa,
    cnpj: admin.cnpj ?? '',
  });

  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  return (
    <Modal title="Editar clínica" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(admin._id, { ...form, cnpj: form.cnpj || null })}>
          <div className="field">
            <label className="field__label" htmlFor="editar-admin-nome">Nome completo</label>
            <input
              id="editar-admin-nome"
              className="input"
              type="text"
              value={form.nomeCompleto}
              onChange={(e) => handleChange('nomeCompleto', e.target.value)}
              data-autofocus
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-admin-empresa">Nome da clínica</label>
              <input
                id="editar-admin-empresa"
                className="input"
                type="text"
                value={form.nomeEmpresa}
                onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-admin-cnpj">CNPJ</label>
              <input
                id="editar-admin-cnpj"
                className="input"
                type="text"
                value={form.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-admin-telefone">Telefone</label>
              <input
                id="editar-admin-telefone"
                className="input"
                type="text"
                value={form.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-admin-email">E-mail</label>
              <input
                id="editar-admin-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
