import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import CampoSenha from '@/components/CampoSenha/CampoSenha';
import { tr } from '@/i18n';

// O super admin define uma senha nova para o administrador que esqueceu a dele e não entra pelo Google.
export default function RedefinirSenhaAdminModal({ admin, erro, onSave, onClose }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const diferentes = confirmar !== '' && novaSenha !== confirmar;

  return (
    <Modal title={tr('Redefinir senha')} onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel={tr('Redefinir senha')}
          submitDisabled={diferentes || novaSenha.length < 6}
          onSubmit={() => onSave(admin._id, novaSenha)}
        >
          <p className="modal-form__hint">
            {tr('Nova senha de')} <strong>{admin.nomeCompleto}</strong> {tr('({email}), da clínica {nomeEmpresa}. Passe a senha à pessoa por um canal seguro e peça que ela troque em "Minha conta".', { email: admin.email, nomeEmpresa: admin.nomeEmpresa })}
          </p>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="admin-nova-senha">{tr('Nova senha')}</label>
              <CampoSenha
                id="admin-nova-senha"
                className="input"
                autoComplete="new-password"
                minLength={6}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="admin-confirmar-senha">{tr('Confirmar nova senha')}</label>
              <CampoSenha
                id="admin-confirmar-senha"
                className="input"
                autoComplete="new-password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
            </div>
          </div>

          {diferentes ? (
            <p className="modal-form__hint modal-form__hint--erro" role="alert">{tr('As senhas não conferem.')}</p>
          ) : (
            <p className="modal-form__hint">{tr('Use ao menos 6 caracteres.')}</p>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
