import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

export default function EditarEmpresaModal({ empresa, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    razaoSocial: empresa.razaoSocial,
    nomeFantasia: empresa.nomeFantasia || '',
    cnpj: empresa.cnpj,
    telefone: empresa.telefone || '',
    email: empresa.email || '',
    endereco: empresa.endereco || '',
    setor: empresa.setor || '',
  });

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  return (
    <Modal title="Editar empresa" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(empresa._id, formEdicao)}>
          <div className="field">
            <label className="field__label" htmlFor="editar-empresa-razao">Razão Social</label>
            <input
              id="editar-empresa-razao"
              className="input"
              type="text"
              value={formEdicao.razaoSocial}
              onChange={(e) => handleChangeEdicao('razaoSocial', e.target.value)}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-empresa-fantasia">Nome Fantasia</label>
              <input
                id="editar-empresa-fantasia"
                className="input"
                type="text"
                value={formEdicao.nomeFantasia}
                onChange={(e) => handleChangeEdicao('nomeFantasia', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-empresa-cnpj">CNPJ</label>
              <input
                id="editar-empresa-cnpj"
                className="input"
                type="text"
                value={formEdicao.cnpj}
                onChange={(e) => handleChangeEdicao('cnpj', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-empresa-telefone">Telefone</label>
              <input
                id="editar-empresa-telefone"
                className="input"
                type="text"
                value={formEdicao.telefone}
                onChange={(e) => handleChangeEdicao('telefone', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-empresa-email">Email</label>
              <input
                id="editar-empresa-email"
                className="input"
                type="email"
                value={formEdicao.email}
                onChange={(e) => handleChangeEdicao('email', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="editar-empresa-endereco">Endereço</label>
            <input
              id="editar-empresa-endereco"
              className="input"
              type="text"
              value={formEdicao.endereco}
              onChange={(e) => handleChangeEdicao('endereco', e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="editar-empresa-setor">Setor</label>
            <input
              id="editar-empresa-setor"
              className="input"
              type="text"
              value={formEdicao.setor}
              onChange={(e) => handleChangeEdicao('setor', e.target.value)}
              placeholder="Ex: Indústria, Comércio, Serviços"
            />
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
