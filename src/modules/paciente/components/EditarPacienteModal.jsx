import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';
import CamposResponsaveis from './CamposResponsaveis';
import { ehMenorDeIdade } from '../paciente.utils';

export default function EditarPacienteModal({ paciente, convenios, empresas, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nome: paciente.nome,
    telefone: paciente.telefone,
    email: paciente.email,
    cpf: paciente.cpf,
    dataNascimento: paciente.dataNascimento ? paciente.dataNascimento.substring(0, 10) : '',
    convenioId: paciente.convenioId?._id ?? paciente.convenioId ?? '',
    empresaId: paciente.empresaId?._id ?? paciente.empresaId ?? '',
    responsaveis: paciente.responsaveis ?? [],
  });

  const menor = ehMenorDeIdade(formEdicao.dataNascimento);

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  function montarPayload() {
    return {
      ...formEdicao,
      convenioId: formEdicao.convenioId || null,
      empresaId: formEdicao.empresaId || null,
    };
  }

  return (
    <Modal title="Editar paciente" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(paciente._id, montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="editar-paciente-nome">Nome</label>
            <input
              id="editar-paciente-nome"
              className="input"
              type="text"
              value={formEdicao.nome}
              onChange={(e) => handleChangeEdicao('nome', e.target.value)}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-telefone">Telefone{menor && ' (opcional)'}</label>
              <input
                id="editar-paciente-telefone"
                className="input"
                type="text"
                value={formEdicao.telefone}
                onChange={(e) => handleChangeEdicao('telefone', e.target.value)}
                required={!menor}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-email">Email{menor && ' (opcional)'}</label>
              <input
                id="editar-paciente-email"
                className="input"
                type="email"
                value={formEdicao.email}
                onChange={(e) => handleChangeEdicao('email', normalizarEmail(e.target.value))}
                required={!menor}
              />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-cpf">CPF (opcional)</label>
              <input
                id="editar-paciente-cpf"
                className="input"
                type="text"
                value={formEdicao.cpf}
                onChange={(e) => handleChangeEdicao('cpf', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-nascimento">Data de Nascimento</label>
              <input
                id="editar-paciente-nascimento"
                className="input"
                type="date"
                value={formEdicao.dataNascimento}
                onChange={(e) => handleChangeEdicao('dataNascimento', e.target.value)}
                required
              />
            </div>
          </div>

          <CamposResponsaveis responsaveis={formEdicao.responsaveis} menor={menor} onChange={(lista) => handleChangeEdicao('responsaveis', lista)} />

          {(convenios.length > 0 || empresas.length > 0) && (
            <div className="modal-form__row">
              {convenios.length > 0 && (
                <div className="field">
                  <label className="field__label" htmlFor="editar-paciente-convenio">Convênio</label>
                  <select
                    id="editar-paciente-convenio"
                    className="input"
                    value={formEdicao.convenioId}
                    onChange={(e) => handleChangeEdicao('convenioId', e.target.value)}
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
                  <label className="field__label" htmlFor="editar-paciente-empresa">Empresa (funcionário)</label>
                  <select
                    id="editar-paciente-empresa"
                    className="input"
                    value={formEdicao.empresaId}
                    onChange={(e) => handleChangeEdicao('empresaId', e.target.value)}
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
        </ModalForm>
      )}
    </Modal>
  );
}
