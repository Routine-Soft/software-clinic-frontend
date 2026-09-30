import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

const FORM_SENHA_INICIAL = { senhaAtual: '', novaSenha: '', confirmarSenha: '' };

// Sem senha (conta criada pelo Google), vira "Criar senha" e não pede a senha atual.
export default function AlterarSenhaModal({ temSenha = true, erro, onSave, onClose }) {
  const [formSenha, setFormSenha] = useState(FORM_SENHA_INICIAL);

  const senhasDiferentes = formSenha.confirmarSenha !== '' && formSenha.novaSenha !== formSenha.confirmarSenha;

  function handleChangeSenha(field, value) {
    setFormSenha({ ...formSenha, [field]: value });
  }

  return (
    <Modal title={temSenha ? 'Alterar senha' : 'Criar senha'} onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel={temSenha ? 'Alterar senha' : 'Criar senha'}
          submitDisabled={senhasDiferentes}
          onSubmit={() => onSave({ currentPassword: formSenha.senhaAtual, newPassword: formSenha.novaSenha })}
        >
          {!temSenha && (
            <p className="modal-form__hint">Sua conta entra pelo Google. Com uma senha, você também pode entrar com e-mail e senha.</p>
          )}

          {temSenha && (
            <div className="field">
              <label className="field__label" htmlFor="senha-atual">Senha atual</label>
              <input
                id="senha-atual"
                className="input"
                type="password"
                autoComplete="current-password"
                value={formSenha.senhaAtual}
                onChange={(e) => handleChangeSenha('senhaAtual', e.target.value)}
                required
              />
            </div>
          )}

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="senha-nova">Nova senha</label>
              <input
                id="senha-nova"
                className="input"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={formSenha.novaSenha}
                onChange={(e) => handleChangeSenha('novaSenha', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="senha-confirmar">Confirmar nova senha</label>
              <input
                id="senha-confirmar"
                className="input"
                type="password"
                autoComplete="new-password"
                value={formSenha.confirmarSenha}
                onChange={(e) => handleChangeSenha('confirmarSenha', e.target.value)}
                required
              />
            </div>
          </div>

          {senhasDiferentes ? (
            <p className="modal-form__hint modal-form__hint--erro" role="alert">As senhas não conferem.</p>
          ) : (
            <p className="modal-form__hint">Use ao menos 6 caracteres.</p>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
