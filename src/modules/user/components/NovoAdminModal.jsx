import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';
import CampoSenha from '@/components/CampoSenha/CampoSenha';
import { tr } from '@/i18n';
import SeletorPais from '@/components/SeletorPais/SeletorPais';

const FORM_INICIAL = { nomeCompleto: '', email: '', nomeEmpresa: '', cnpj: '', telefone: '', password: '', pais: 'BR' };

// Cadastro de uma nova clínica pelo super_admin: cria o usuário admin dela, já com o teste grátis.
export default function NovoAdminModal({ erro, onSave, onClose }) {
  const [form, setForm] = useState(FORM_INICIAL);

  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  return (
    <Modal title={tr('Nova clínica')} onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel={tr('Cadastrar clínica')}
          loadingLabel={tr('Cadastrando...')}
          onSubmit={() => onSave({ ...form, cnpj: form.cnpj || null })}
        >
          <div className="field">
            <label className="field__label" htmlFor="novo-admin-nome">{tr('Nome completo')}</label>
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
              <label className="field__label" htmlFor="novo-admin-empresa">{tr('Nome da clínica')}</label>
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
              <label className="field__label" htmlFor="novo-admin-cnpj">{tr('CNPJ (opcional)')}</label>
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
              <label className="field__label" htmlFor="novo-admin-telefone">{tr('Telefone')}</label>
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
              <label className="field__label" htmlFor="novo-admin-email">{tr('E-mail')}</label>
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
            <label className="field__label" htmlFor="novo-admin-senha">{tr('Senha')}</label>
            <CampoSenha
              id="novo-admin-senha"
              className="input"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="novo-admin-pais">{tr('País da clínica')}</label>
            <SeletorPais id="novo-admin-pais" value={form.pais} onChange={(pais) => handleChange('pais', pais)} />
            <p className="field__hint">{tr('Brasil paga pelo Mercado Pago, em reais. Outros países pagam pelo Stripe, em dólar.')}</p>
          </div>

          <p className="modal-form__hint">{tr('A clínica entra com este e-mail e senha e começa no teste grátis de 7 dias, sem cartão.')}</p>
        </ModalForm>
      )}
    </Modal>
  );
}
