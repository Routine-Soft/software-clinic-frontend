import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';

const FORM_CRIAR_INICIAL = { nomeCompleto: '', email: '', telefone: '', password: '', role: 'recepcao' };

export default function NovoUsuarioModal({ erro, onSave, onClose }) {
  const [formCriar, setFormCriar] = useState(FORM_CRIAR_INICIAL);

  function handleChangeCriar(field, value) {
    setFormCriar({ ...formCriar, [field]: value });
  }

  return (
    <Modal title="Novo colaborador" onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel="Cadastrar usuário"
          loadingLabel="Cadastrando..."
          onSubmit={() => onSave({
            nomeCompleto: formCriar.nomeCompleto,
            email: formCriar.email,
            telefone: formCriar.telefone,
            password: formCriar.password,
            role: formCriar.role,
          })}
        >
          <div className="field">
            <label className="field__label" htmlFor="novo-usuario-nome">Nome completo</label>
            <input
              id="novo-usuario-nome"
              className="input"
              type="text"
              value={formCriar.nomeCompleto}
              onChange={(e) => handleChangeCriar('nomeCompleto', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="novo-usuario-email">Email</label>
            <input
              id="novo-usuario-email"
              className="input"
              type="email"
              value={formCriar.email}
              onChange={(e) => handleChangeCriar('email', normalizarEmail(e.target.value))}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="novo-usuario-telefone">Telefone</label>
              <input
                id="novo-usuario-telefone"
                className="input"
                type="text"
                value={formCriar.telefone}
                onChange={(e) => handleChangeCriar('telefone', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="novo-usuario-funcao">Função</label>
              <select
                id="novo-usuario-funcao"
                className="input"
                value={formCriar.role}
                onChange={(e) => handleChangeCriar('role', e.target.value)}
              >
                <option value="recepcao">Recepção</option>
                <option value="profissional">Profissional</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="novo-usuario-senha">Senha</label>
            <input
              id="novo-usuario-senha"
              className="input"
              type="password"
              autoComplete="new-password"
              value={formCriar.password}
              onChange={(e) => handleChangeCriar('password', e.target.value)}
              required
            />
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
