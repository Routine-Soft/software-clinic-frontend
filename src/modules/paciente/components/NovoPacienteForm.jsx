import { useId, useState } from 'react';
import { IconeMais } from '@/components/CrudCard/icones';
import { normalizarEmail } from '@/utils/email';
import CamposResponsaveis from './CamposResponsaveis';
import { ehMenorDeIdade } from '../paciente.utils';

const FORM_CRIAR_INICIAL = { nome: '', telefone: '', email: '', cpf: '', dataNascimento: '', convenioId: '', empresaId: '', responsaveis: [] };

export default function NovoPacienteForm({ convenios, empresas, onSubmit }) {
  const ids = useId();
  const [formCriar, setFormCriar] = useState(FORM_CRIAR_INICIAL);
  const [criando, setCriando] = useState(false);

  const menor = ehMenorDeIdade(formCriar.dataNascimento);

  function handleChangeCriar(field, value) {
    setFormCriar({ ...formCriar, [field]: value });
  }

  async function handleSubmitCriar(e) {
    e.preventDefault();
    setCriando(true);

    const criado = await onSubmit({
      ...formCriar,
      convenioId: formCriar.convenioId || null,
      empresaId: formCriar.empresaId || null,
    });

    setCriando(false);
    if (criado) setFormCriar(FORM_CRIAR_INICIAL);
  }

  return (
    <form className="crud-card__form crud-card__form--campos" onSubmit={handleSubmitCriar}>
      <div className="field field--full">
        <label className="field__label" htmlFor={`${ids}-nome`}>Nome</label>
        <input
          id={`${ids}-nome`}
          className="input"
          type="text"
          value={formCriar.nome}
          onChange={(e) => handleChangeCriar('nome', e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${ids}-telefone`}>Telefone{menor && ' (opcional)'}</label>
        <input
          id={`${ids}-telefone`}
          className="input"
          type="text"
          value={formCriar.telefone}
          onChange={(e) => handleChangeCriar('telefone', e.target.value)}
          required={!menor}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${ids}-email`}>Email{menor && ' (opcional)'}</label>
        <input
          id={`${ids}-email`}
          className="input"
          type="email"
          value={formCriar.email}
          onChange={(e) => handleChangeCriar('email', normalizarEmail(e.target.value))}
          required={!menor}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${ids}-cpf`}>CPF</label>
        <input
          id={`${ids}-cpf`}
          className="input"
          type="text"
          value={formCriar.cpf}
          onChange={(e) => handleChangeCriar('cpf', e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${ids}-nascimento`}>Data de nascimento</label>
        <input
          id={`${ids}-nascimento`}
          className="input"
          type="date"
          value={formCriar.dataNascimento}
          onChange={(e) => handleChangeCriar('dataNascimento', e.target.value)}
          required
        />
      </div>

      <div className="field field--full">
        <CamposResponsaveis responsaveis={formCriar.responsaveis} menor={menor} onChange={(lista) => handleChangeCriar('responsaveis', lista)} />
      </div>

      {convenios.length > 0 && (
        <div className="field">
          <label className="field__label" htmlFor={`${ids}-convenio`}>Convênio (opcional)</label>
          <select
            id={`${ids}-convenio`}
            className="input"
            value={formCriar.convenioId}
            onChange={(e) => handleChangeCriar('convenioId', e.target.value)}
          >
            <option value="">Particular</option>
            {convenios.map((convenio) => (
              <option key={convenio._id} value={convenio._id}>{convenio.nome}</option>
            ))}
          </select>
        </div>
      )}

      {empresas.length > 0 && (
        <div className="field">
          <label className="field__label" htmlFor={`${ids}-empresa`}>Empresa (funcionário)</label>
          <select
            id={`${ids}-empresa`}
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

      <button className={`btn btn--primary${criando ? ' btn--loading' : ''}`} type="submit" disabled={criando}>
        {!criando && <IconeMais />}
        {criando ? 'Cadastrando...' : 'Cadastrar paciente'}
      </button>
    </form>
  );
}
