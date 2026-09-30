import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';

export default function EditarMinhaContaModal({ perfil, ehAdmin, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nomeCompleto: perfil.nomeCompleto,
    email: perfil.email,
    telefone: perfil.telefone,
    nomeEmpresa: perfil.nomeEmpresa ?? '',
    cnpj: perfil.cnpj ?? '',
  });

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  function montarPayload() {
    const dados = {
      nomeCompleto: formEdicao.nomeCompleto,
      email: formEdicao.email,
      telefone: formEdicao.telefone,
    };
    if (ehAdmin) {
      dados.nomeEmpresa = formEdicao.nomeEmpresa;
      dados.cnpj = formEdicao.cnpj;
    }
    return dados;
  }

  return (
    <Modal title="Editar meus dados" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="minha-conta-nome">Nome completo</label>
            <input
              id="minha-conta-nome"
              className="input"
              type="text"
              value={formEdicao.nomeCompleto}
              onChange={(e) => handleChangeEdicao('nomeCompleto', e.target.value)}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="minha-conta-email">E-mail</label>
              <input
                id="minha-conta-email"
                className="input"
                type="email"
                value={formEdicao.email}
                onChange={(e) => handleChangeEdicao('email', normalizarEmail(e.target.value))}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="minha-conta-telefone">Telefone</label>
              <input
                id="minha-conta-telefone"
                className="input"
                type="text"
                value={formEdicao.telefone}
                onChange={(e) => handleChangeEdicao('telefone', e.target.value)}
                required
              />
            </div>
          </div>

          {ehAdmin && (
            <fieldset className="modal-form__section">
              <legend>Dados da clínica</legend>

              <div className="modal-form__row">
                <div className="field">
                  <label className="field__label" htmlFor="minha-conta-clinica">Nome da clínica</label>
                  <input
                    id="minha-conta-clinica"
                    className="input"
                    type="text"
                    value={formEdicao.nomeEmpresa}
                    onChange={(e) => handleChangeEdicao('nomeEmpresa', e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="minha-conta-cnpj">CNPJ (opcional)</label>
                  <input
                    id="minha-conta-cnpj"
                    className="input"
                    type="text"
                    value={formEdicao.cnpj}
                    onChange={(e) => handleChangeEdicao('cnpj', e.target.value)}
                  />
                </div>
              </div>
            </fieldset>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
