import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';

const FORM_INICIAL = { nomeCompleto: '', email: '', nomeEmpresa: '', cnpj: '', telefone: '', password: '' };

// Cadastro de uma nova clínica pelo super_admin: cria o usuário admin dela, já com o período de teste do plano gratuito.
export default function NovoAdminModal({ erro, onSave, onClose }) {
  const [form, setForm] = useState(FORM_INICIAL);

  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  return (
    <Modal title="Nova clínica" onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel="Cadastrar clínica"
          loadingLabel="Cadastrando..."
          onSubmit={() => onSave({ ...form, cnpj: form.cnpj || null })}
        >
          <div className="field">
            <label className="field__label" htmlFor="novo-admin-nome">Nome completo</label>
            <input
              id="novo-admin-nome"
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
              <label className="field__label" htmlFor="novo-admin-empresa">Nome da clínica</label>
              <input
                id="novo-admin-empresa"
                className="input"
                type="text"
                value={form.nomeEmpresa}
                onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="novo-admin-cnpj">CNPJ (opcional)</label>
              <input
                id="novo-admin-cnpj"
                className="input"
                type="text"
                value={form.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="novo-admin-telefone">Telefone</label>
              <input
                id="novo-admin-telefone"
                className="input"
                type="text"
                value={form.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="novo-admin-email">E-mail</label>
              <input
                id="novo-admin-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', normalizarEmail(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="novo-admin-senha">Senha</label>
            <input
              id="novo-admin-senha"
              className="input"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              minLength={6}
              required
            />
          </div>
          <p className="modal-form__hint">A clínica entra com este e-mail e senha e começa no plano gratuito, em período de teste.</p>
        </ModalForm>
      )}
    </Modal>
  );
}
