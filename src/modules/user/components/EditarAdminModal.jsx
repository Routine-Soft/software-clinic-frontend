import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';
import { tr } from '@/i18n';
import SeletorPais from '@/components/SeletorPais/SeletorPais';

export default function EditarAdminModal({ admin, erro, onSave, onClose }) {
  const [form, setForm] = useState({
    nomeCompleto: admin.nomeCompleto,
    email: admin.email,
    telefone: admin.telefone,
    nomeEmpresa: admin.nomeEmpresa,
    cnpj: admin.cnpj ?? '',
    pais: admin.pais ?? 'BR',
  });

  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  return (
    <Modal title={tr('Editar clínica')} onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(admin._id, { ...form, cnpj: form.cnpj || null })}>
          <div className="field">
            <label className="field__label" htmlFor="editar-admin-nome">{tr('Nome completo')}</label>
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
              <label className="field__label" htmlFor="editar-admin-empresa">{tr('Nome da clínica')}</label>
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
              <label className="field__label" htmlFor="editar-admin-telefone">{tr('Telefone')}</label>
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
              <label className="field__label" htmlFor="editar-admin-email">{tr('E-mail')}</label>
              <input
                id="editar-admin-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', normalizarEmail(e.target.value))}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="editar-admin-pais">{tr('País da clínica')}</label>
            <SeletorPais id="editar-admin-pais" value={form.pais} onChange={(pais) => handleChange('pais', pais)} />
            <p className="field__hint">{tr('Brasil paga pelo Mercado Pago, em reais. Outros países pagam pelo Stripe, em dólar.')}</p>
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
