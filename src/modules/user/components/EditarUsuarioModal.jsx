import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { ROTULO_FUNCAO } from '../user.constants';
import { normalizarEmail } from '@/utils/email';

const FUNCOES_EDITAVEIS = ['profissional', 'recepcao'];

export default function EditarUsuarioModal({ usuario, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nomeCompleto: usuario.nomeCompleto,
    email: usuario.email,
    telefone: usuario.telefone,
    role: usuario.role,
  });

  const funcaoEditavel = FUNCOES_EDITAVEIS.includes(usuario.role);

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  function montarPayload() {
    const dados = {
      nomeCompleto: formEdicao.nomeCompleto,
      email: formEdicao.email,
      telefone: formEdicao.telefone,
    };
    if (funcaoEditavel) dados.role = formEdicao.role;
    return dados;
  }

  return (
    <Modal title="Editar colaborador" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(usuario._id, montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="editar-usuario-nome">Nome completo</label>
            <input
              id="editar-usuario-nome"
              className="input"
              type="text"
              value={formEdicao.nomeCompleto}
              onChange={(e) => handleChangeEdicao('nomeCompleto', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="editar-usuario-email">Email</label>
            <input
              id="editar-usuario-email"
              className="input"
              type="email"
              value={formEdicao.email}
              onChange={(e) => handleChangeEdicao('email', normalizarEmail(e.target.value))}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-usuario-telefone">Telefone</label>
              <input
                id="editar-usuario-telefone"
                className="input"
                type="text"
                value={formEdicao.telefone}
                onChange={(e) => handleChangeEdicao('telefone', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-usuario-funcao">Função</label>
              {funcaoEditavel ? (
                <select
                  id="editar-usuario-funcao"
                  className="input"
                  value={formEdicao.role}
                  onChange={(e) => handleChangeEdicao('role', e.target.value)}
                >
                  <option value="recepcao">Recepção</option>
                  <option value="profissional">Profissional</option>
                </select>
              ) : (
                <select id="editar-usuario-funcao" className="input" value={usuario.role} disabled>
                  <option value={usuario.role}>{ROTULO_FUNCAO[usuario.role] ?? usuario.role}</option>
                </select>
              )}
            </div>
          </div>

          {!funcaoEditavel && (
            <p className="modal-form__hint">A função do administrador não pode ser alterada por aqui.</p>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
