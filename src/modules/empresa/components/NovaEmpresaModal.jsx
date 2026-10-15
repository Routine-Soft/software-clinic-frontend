import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';
import { tr } from '@/i18n';

const FORM_CRIAR_INICIAL = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  telefone: '',
  email: '',
  endereco: '',
  setor: '',
};

export default function NovaEmpresaModal({ erro, onSave, onClose }) {
  const [formCriar, setFormCriar] = useState(FORM_CRIAR_INICIAL);

  function handleChangeCriar(field, value) {
    setFormCriar({ ...formCriar, [field]: value });
  }

  return (
    <Modal title={tr('Nova empresa')} onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} submitLabel={tr('Cadastrar empresa')} loadingLabel={tr('Cadastrando...')} onSubmit={() => onSave(formCriar)}>
          <div className="field">
            <label className="field__label" htmlFor="nova-empresa-razao">{tr('Razão Social')}</label>
            <input
              id="nova-empresa-razao"
              className="input"
              type="text"
              value={formCriar.razaoSocial}
              onChange={(e) => handleChangeCriar('razaoSocial', e.target.value)}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="nova-empresa-fantasia">{tr('Nome Fantasia')}</label>
              <input
                id="nova-empresa-fantasia"
                className="input"
                type="text"
                value={formCriar.nomeFantasia}
                onChange={(e) => handleChangeCriar('nomeFantasia', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="nova-empresa-cnpj">CNPJ</label>
              <input
                id="nova-empresa-cnpj"
                className="input"
                type="text"
                value={formCriar.cnpj}
                onChange={(e) => handleChangeCriar('cnpj', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="nova-empresa-telefone">{tr('Telefone')}</label>
              <input
                id="nova-empresa-telefone"
                className="input"
                type="text"
                value={formCriar.telefone}
                onChange={(e) => handleChangeCriar('telefone', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="nova-empresa-email">{tr('Email')}</label>
              <input
                id="nova-empresa-email"
                className="input"
                type="email"
                value={formCriar.email}
                onChange={(e) => handleChangeCriar('email', normalizarEmail(e.target.value))}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="nova-empresa-endereco">{tr('Endereço')}</label>
            <input
              id="nova-empresa-endereco"
              className="input"
              type="text"
              value={formCriar.endereco}
              onChange={(e) => handleChangeCriar('endereco', e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="nova-empresa-setor">{tr('Setor')}</label>
            <input
              id="nova-empresa-setor"
              className="input"
              type="text"
              value={formCriar.setor}
              onChange={(e) => handleChangeCriar('setor', e.target.value)}
              placeholder={tr('Ex: Indústria, Comércio, Serviços')}
            />
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
