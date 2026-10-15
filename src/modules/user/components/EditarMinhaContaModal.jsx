import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';
import { formatarDocumento } from '@/utils/documento';
import { tr } from '@/i18n';

export default function EditarMinhaContaModal({ perfil, ehAdmin, ehAfiliado, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nomeCompleto: perfil.nomeCompleto,
    email: perfil.email,
    telefone: perfil.telefone,
    nomeEmpresa: perfil.nomeEmpresa ?? '',
    cnpj: perfil.cnpj ?? '',
    documento: perfil.documento ? formatarDocumento(perfil.documento) : '',
    chavePix: perfil.chavePix ?? '',
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
    if (ehAfiliado) {
      dados.documento = formEdicao.documento;
      dados.chavePix = formEdicao.chavePix;
    }
    return dados;
  }

  return (
    <Modal title={tr('Editar meus dados')} onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="minha-conta-nome">{tr('Nome completo')}</label>
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
              <label className="field__label" htmlFor="minha-conta-email">{tr('E-mail')}</label>
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
              <label className="field__label" htmlFor="minha-conta-telefone">{tr('Telefone')}</label>
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

          {ehAfiliado && (
            <fieldset className="modal-form__section">
              <legend>{tr('Para receber as comissões')}</legend>

              <div className="modal-form__row">
                <div className="field">
                  <label className="field__label" htmlFor="minha-conta-documento">{tr('CPF ou CNPJ')}</label>
                  <input
                    id="minha-conta-documento"
                    className="input"
                    type="text"
                    inputMode="numeric"
                    value={formEdicao.documento}
                    onChange={(e) => handleChangeEdicao('documento', e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="minha-conta-pix">{tr('Chave Pix')}</label>
                  <input
                    id="minha-conta-pix"
                    className="input"
                    type="text"
                    value={formEdicao.chavePix}
                    onChange={(e) => handleChangeEdicao('chavePix', e.target.value)}
                    required
                  />
                </div>
              </div>
            </fieldset>
          )}

          {ehAdmin && (
            <fieldset className="modal-form__section">
              <legend>{tr('Dados da clínica')}</legend>

              <div className="modal-form__row">
                <div className="field">
                  <label className="field__label" htmlFor="minha-conta-clinica">{tr('Nome da clínica')}</label>
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
                  <label className="field__label" htmlFor="minha-conta-cnpj">{tr('CNPJ (opcional)')}</label>
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
