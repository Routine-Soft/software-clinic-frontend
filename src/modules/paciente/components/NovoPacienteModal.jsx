import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';
import CamposResponsaveis from './CamposResponsaveis';
import CampoPacienteTeste from './CampoPacienteTeste';
import { ehMenorDeIdade } from '../paciente.utils';

const FORM_CRIAR_INICIAL = { nome: '', telefone: '', email: '', cpf: '', dataNascimento: '', convenioId: '', empresaId: '', responsaveis: [], teste: false };

export default function NovoPacienteModal({ convenios, empresas, erro, onSave, onClose }) {
  const [formCriar, setFormCriar] = useState(FORM_CRIAR_INICIAL);

  const menor = ehMenorDeIdade(formCriar.dataNascimento);

  function handleChangeCriar(field, value) {
    setFormCriar({ ...formCriar, [field]: value });
  }

  function montarPayload() {
    return {
      ...formCriar,
      convenioId: formCriar.convenioId || null,
      empresaId: formCriar.empresaId || null,
    };
  }

  return (
    <Modal title="Novo paciente" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} submitLabel="Cadastrar paciente" loadingLabel="Cadastrando..." onSubmit={() => onSave(montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="novo-paciente-nome">Nome</label>
            <input
              id="novo-paciente-nome"
              className="input"
              type="text"
              value={formCriar.nome}
              onChange={(e) => handleChangeCriar('nome', e.target.value)}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="novo-paciente-telefone">Telefone{menor && ' (opcional)'}</label>
              <input
                id="novo-paciente-telefone"
                className="input"
                type="text"
                value={formCriar.telefone}
                onChange={(e) => handleChangeCriar('telefone', e.target.value)}
                required={!menor}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="novo-paciente-email">Email{menor && ' (opcional)'}</label>
              <input
                id="novo-paciente-email"
                className="input"
                type="email"
                value={formCriar.email}
                onChange={(e) => handleChangeCriar('email', normalizarEmail(e.target.value))}
                required={!menor}
              />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="novo-paciente-cpf">CPF (opcional)</label>
              <input
                id="novo-paciente-cpf"
                className="input"
                type="text"
                value={formCriar.cpf}
                onChange={(e) => handleChangeCriar('cpf', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="novo-paciente-nascimento">Data de Nascimento</label>
              <input
                id="novo-paciente-nascimento"
                className="input"
                type="date"
                value={formCriar.dataNascimento}
                onChange={(e) => handleChangeCriar('dataNascimento', e.target.value)}
                required
              />
            </div>
          </div>

          <CamposResponsaveis responsaveis={formCriar.responsaveis} menor={menor} onChange={(lista) => handleChangeCriar('responsaveis', lista)} />

          {(convenios.length > 0 || empresas.length > 0) && (
            <div className="modal-form__row">
              {convenios.length > 0 && (
                <div className="field">
                  <label className="field__label" htmlFor="novo-paciente-convenio">Convênio</label>
                  <select
                    id="novo-paciente-convenio"
                    className="input"
                    value={formCriar.convenioId}
                    onChange={(e) => handleChangeCriar('convenioId', e.target.value)}
                  >
                    <option value="">Nenhum</option>
                    {convenios.map((convenio) => (
                      <option key={convenio._id} value={convenio._id}>{convenio.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              {empresas.length > 0 && (
                <div className="field">
                  <label className="field__label" htmlFor="novo-paciente-empresa">Empresa (funcionário)</label>
                  <select
                    id="novo-paciente-empresa"
                    className="input"
                    value={formCriar.empresaId}
                    onChange={(e) => handleChangeCriar('empresaId', e.target.value)}
                  >
                    <option value="">Nenhuma</option>
                    {empresas.map((empresa) => (
                      <option key={empresa._id} value={empresa._id}>{empresa.razaoSocial}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <CampoPacienteTeste marcado={formCriar.teste} onChange={(valor) => handleChangeCriar('teste', valor)} />
        </ModalForm>
      )}
    </Modal>
  );
}
