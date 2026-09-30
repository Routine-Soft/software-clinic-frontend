import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

// O super admin define uma senha nova para o administrador que esqueceu a dele e não entra pelo Google.
export default function RedefinirSenhaAdminModal({ admin, erro, onSave, onClose }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const diferentes = confirmar !== '' && novaSenha !== confirmar;

  return (
    <Modal title="Redefinir senha" onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel="Redefinir senha"
          submitDisabled={diferentes || novaSenha.length < 6}
          onSubmit={() => onSave(admin._id, novaSenha)}
        >
          <p className="modal-form__hint">
            Nova senha de <strong>{admin.nomeCompleto}</strong> ({admin.email}), da clínica {admin.nomeEmpresa}.
            Passe a senha à pessoa por um canal seguro e peça que ela troque em &quot;Minha conta&quot;.
          </p>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="admin-nova-senha">Nova senha</label>
              <input
                id="admin-nova-senha"
                className="input"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="admin-confirmar-senha">Confirmar nova senha</label>
              <input
                id="admin-confirmar-senha"
                className="input"
                type="password"
                autoComplete="new-password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
            </div>
          </div>

          {diferentes ? (
            <p className="modal-form__hint modal-form__hint--erro" role="alert">As senhas não conferem.</p>
          ) : (
            <p className="modal-form__hint">Use ao menos 6 caracteres.</p>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
