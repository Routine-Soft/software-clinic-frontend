import { useId } from 'react';
import { normalizarEmail } from '@/utils/email';
import { IconeMais, IconeX } from '@/components/CrudCard/icones';
import { PARENTESCOS, RESPONSAVEL_VAZIO } from '../paciente.utils';

// Até dois responsáveis legais. Para menor de idade o bloco já aparece aberto; para adulto, só se a clínica pedir
// (ex.: paciente interditado). Por enquanto todos os campos são opcionais; só o nome passa a ser exigido
// quando algo do responsável é preenchido.
export default function CamposResponsaveis({ responsaveis, onChange, menor }) {
  const ids = useId();
  const lista = responsaveis.length ? responsaveis : menor ? [RESPONSAVEL_VAZIO] : [];

  if (!lista.length) {
    return (
      <button type="button" className="btn btn--ghost btn--sm responsaveis__abrir" onClick={() => onChange([{ ...RESPONSAVEL_VAZIO }])}>
        <IconeMais />
        Adicionar responsável legal
      </button>
    );
  }

  function alterar(indice, campo, valor) {
    onChange(lista.map((r, i) => (i === indice ? { ...r, [campo]: valor } : r)));
  }

  function remover(indice) {
    onChange(lista.filter((_, i) => i !== indice));
  }

  return (
    <fieldset className="modal-form__section responsaveis">
      <legend>{menor ? 'Responsáveis (paciente menor de idade)' : 'Responsáveis'}</legend>
      <p className="modal-form__hint">
        {menor
          ? 'Opcional por enquanto. Sem telefone ou e-mail da criança, o contato da clínica é com o responsável.'
          : 'Opcional. Use para paciente que precisa de um responsável legal.'}
      </p>

      {lista.map((responsavel, i) => {
        const id = `${ids}-${i}`;
        const algoPreenchido = Object.values(responsavel).some(Boolean);
        return (
          <div key={i} className="responsavel">
            <div className="responsavel__cab">
              <strong>{i === 0 ? 'Responsável' : 'Segundo responsável'}</strong>
              {(lista.length > 1 || !menor) && (
                <button type="button" className="icon-btn" aria-label={`Remover ${i === 0 ? 'responsável' : 'segundo responsável'}`} title="Remover" onClick={() => remover(i)}>
                  <IconeX />
                </button>
              )}
            </div>

            <div className="responsavel__campos">
              <div className="field responsavel__nome">
                <label className="field__label" htmlFor={`${id}-nome`}>Nome</label>
                <input id={`${id}-nome`} className="input" type="text" value={responsavel.nome} onChange={(e) => alterar(i, 'nome', e.target.value)} required={algoPreenchido} />
              </div>

              <div className="field">
                <label className="field__label" htmlFor={`${id}-parentesco`}>Parentesco</label>
                <select id={`${id}-parentesco`} className="input" value={responsavel.parentesco} onChange={(e) => alterar(i, 'parentesco', e.target.value)}>
                  <option value="">Selecione</option>
                  {PARENTESCOS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor={`${id}-cpf`}>CPF</label>
                <input id={`${id}-cpf`} className="input" type="text" inputMode="numeric" value={responsavel.cpf} onChange={(e) => alterar(i, 'cpf', e.target.value)} />
              </div>

              <div className="field">
                <label className="field__label" htmlFor={`${id}-telefone`}>Telefone</label>
                <input id={`${id}-telefone`} className="input" type="tel" value={responsavel.telefone} onChange={(e) => alterar(i, 'telefone', e.target.value)} />
              </div>

              <div className="field">
                <label className="field__label" htmlFor={`${id}-email`}>Email</label>
                <input id={`${id}-email`} className="input" type="email" value={responsavel.email} onChange={(e) => alterar(i, 'email', normalizarEmail(e.target.value))} />
              </div>
            </div>
          </div>
        );
      })}

      {lista.length < 2 && (
        <button type="button" className="btn btn--ghost btn--sm responsaveis__abrir" onClick={() => onChange([...lista, { ...RESPONSAVEL_VAZIO }])}>
          <IconeMais />
          Adicionar segundo responsável
        </button>
      )}
    </fieldset>
  );
}
