import { useId, useMemo } from 'react';
import { IconeMais, IconeX } from '@/components/CrudCard/icones';
import { FORMAS_PAGAMENTO, horarioInvalido, somarMinutos, DURACAO_PADRAO_MINUTOS, comPrecoDaTabela } from '../agendamento.form';

// Campos comuns de criar e editar agendamento. O paciente é escolhido fora (PacientePicker).
export default function AgendamentoCampos({ form, setForm, profissionais, especialidades, salas, servicos, convenios }) {
  const id = useId();

  const profissionaisFiltrados = useMemo(() => {
    if (!form.especialidadeId) return profissionais;
    return profissionais.filter((p) => (p.especialidadeIds ?? []).some((e) => (e?._id ?? e) === form.especialidadeId));
  }, [profissionais, form.especialidadeId]);

  function set(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function setFinanceiro(campo, valor) {
    setForm((atual) => ({ ...atual, financeiro: { ...atual.financeiro, [campo]: valor } }));
  }

  // O valor vem da tabela do serviço para o convênio escolhido (ou do particular); dá para ajustar à mão depois.
  function handleServico(servicoId) {
    setForm((atual) => comPrecoDaTabela({ ...atual, servicoId }, servicos));
  }

  function handleConvenio(convenioId) {
    setForm((atual) => comPrecoDaTabela({ ...atual, convenioId }, servicos));
  }

  function handleHoraInicio(valor) {
    setForm((atual) => ({ ...atual, horaInicio: valor, horaFim: somarMinutos(valor, DURACAO_PADRAO_MINUTOS) }));
  }

  function setForma(index, campo, valor) {
    setForm((atual) => {
      const formasPagamento = [...atual.financeiro.formasPagamento];
      formasPagamento[index] = { ...formasPagamento[index], [campo]: valor };
      return { ...atual, financeiro: { ...atual.financeiro, formasPagamento } };
    });
  }

  function adicionarForma() {
    setForm((atual) => ({
      ...atual,
      financeiro: { ...atual.financeiro, formasPagamento: [...atual.financeiro.formasPagamento, { tipo: 'pix', valor: '' }] },
    }));
  }

  function removerForma(index) {
    setForm((atual) => ({
      ...atual,
      financeiro: { ...atual.financeiro, formasPagamento: atual.financeiro.formasPagamento.filter((_, i) => i !== index) },
    }));
  }

  return (
    <>
      <div className="modal-form__row">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-especialidade`}>Especialidade</label>
          <select id={`${id}-especialidade`} className="input" value={form.especialidadeId} onChange={(e) => set('especialidadeId', e.target.value)}>
            <option value="">Todas</option>
            {especialidades.map((e) => (
              <option key={e._id} value={e._id}>{e.nome}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-profissional`}>Profissional</label>
          <select id={`${id}-profissional`} className="input" value={form.profissionalId} onChange={(e) => set('profissionalId', e.target.value)} required>
            <option value="">Selecione</option>
            {profissionaisFiltrados.map((p) => (
              <option key={p._id} value={p._id}>{p.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="modal-form__row">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-servico`}>Serviço</label>
          <select id={`${id}-servico`} className="input" value={form.servicoId} onChange={(e) => handleServico(e.target.value)} required>
            <option value="">Selecione</option>
            {servicos.map((s) => (
              <option key={s._id} value={s._id}>{s.nome} ({s.tipo})</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-sala`}>Sala</label>
          <select id={`${id}-sala`} className="input" value={form.salaId} onChange={(e) => set('salaId', e.target.value)} required>
            <option value="">Selecione</option>
            {salas.map((s) => (
              <option key={s._id} value={s._id}>{s.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="agendamento-quando">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-data`}>Data</label>
          <input id={`${id}-data`} className="input" type="date" value={form.data} onChange={(e) => set('data', e.target.value)} required />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-inicio`}>Início</label>
          <input id={`${id}-inicio`} className="input" type="time" value={form.horaInicio} onChange={(e) => handleHoraInicio(e.target.value)} required />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-fim`}>Fim</label>
          <input id={`${id}-fim`} className="input" type="time" value={form.horaFim} onChange={(e) => set('horaFim', e.target.value)} required />
        </div>
      </div>
      {horarioInvalido(form) && <p className="modal-form__hint modal-form__hint--erro">O horário final precisa ser depois do inicial.</p>}

      <div className="field">
        <label className="field__label" htmlFor={`${id}-convenio`}>Convênio</label>
        <select id={`${id}-convenio`} className="input" value={form.convenioId} onChange={(e) => handleConvenio(e.target.value)}>
          <option value="">Particular</option>
          {convenios.map((c) => (
            <option key={c._id} value={c._id}>{c.nome}</option>
          ))}
        </select>
      </div>

      <fieldset className="modal-form__section">
        <legend>Financeiro</legend>

        <div className="agendamento-financeiro">
          <div className="field">
            <label className="field__label" htmlFor={`${id}-valor`}>Total a pagar (R$)</label>
            <input id={`${id}-valor`} className="input" type="number" min="0" step="0.01" value={form.financeiro.valor} onChange={(e) => setFinanceiro('valor', e.target.value)} required />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${id}-venc`}>Vencimento</label>
            <input id={`${id}-venc`} className="input" type="date" value={form.financeiro.vencimento} onChange={(e) => setFinanceiro('vencimento', e.target.value)} required />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${id}-parcelas`}>Parcelas</label>
            <input id={`${id}-parcelas`} className="input" type="number" min="1" value={form.financeiro.parcelamento} onChange={(e) => setFinanceiro('parcelamento', e.target.value)} />
          </div>
        </div>

        {form.financeiro.formasPagamento.map((forma, index) => (
          <div className="agendamento-forma" key={index}>
            <select className="input" aria-label={`Forma de pagamento ${index + 1}`} value={forma.tipo} onChange={(e) => setForma(index, 'tipo', e.target.value)}>
              {FORMAS_PAGAMENTO.map(([valor, rotulo]) => (
                <option key={valor} value={valor}>{rotulo}</option>
              ))}
            </select>
            <input className="input" type="number" min="0" step="0.01" placeholder="Valor" aria-label={`Valor da forma de pagamento ${index + 1}`} value={forma.valor} onChange={(e) => setForma(index, 'valor', e.target.value)} />
            <button type="button" className="icon-btn icon-btn--danger" aria-label={`Remover forma de pagamento ${index + 1}`} onClick={() => removerForma(index)}>
              <IconeX />
            </button>
          </div>
        ))}

        <div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={adicionarForma}>
            <IconeMais />
            Forma de pagamento
          </button>
        </div>
      </fieldset>
    </>
  );
}
