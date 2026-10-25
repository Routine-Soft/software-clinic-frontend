import { useId, useMemo } from 'react';
import { horarioInvalido, somarMinutos, DURACAO_PADRAO_MINUTOS, comPrecoDaTabela } from '../agendamento.form';
import { idsQueAcompanham } from '@/modules/paciente/paciente.utils';
import { tr } from '@/i18n';

// Campos comuns de criar e editar agendamento. O paciente é escolhido fora (PacientePicker) e o pagamento
// fica em FormaPagamentoCampos.
export default function AgendamentoCampos({ form, setForm, paciente, profissionais, especialidades, salas, servicos, convenios }) {
  const id = useId();

  const profissionaisFiltrados = useMemo(() => {
    if (!form.especialidadeId) return profissionais;
    return profissionais.filter((p) => (p.especialidadeIds ?? []).some((e) => (e?._id ?? e) === form.especialidadeId));
  }, [profissionais, form.especialidadeId]);

  // Quem acompanha o paciente vira atalho acima da lista de profissionais.
  const queAcompanham = useMemo(() => {
    const ids = idsQueAcompanham(paciente);
    return profissionais.filter((p) => ids.includes(p._id));
  }, [paciente, profissionais]);

  // Escolher pelo atalho tira o filtro de especialidade se ele esconderia o profissional.
  function escolherProfissional(profissional) {
    setForm((atual) => {
      const visivel = !atual.especialidadeId || (profissional.especialidadeIds ?? []).some((e) => (e?._id ?? e) === atual.especialidadeId);
      return { ...atual, profissionalId: profissional._id, especialidadeId: visivel ? atual.especialidadeId : '' };
    });
  }

  function set(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  // O valor vem da tabela do serviço para o convênio escolhido (ou do preço padrão); dá para ajustar à mão depois.
  function handleServico(servicoId) {
    setForm((atual) => comPrecoDaTabela({ ...atual, servicoId }, servicos));
  }

  function handleConvenio(convenioId) {
    setForm((atual) => comPrecoDaTabela({ ...atual, convenioId }, servicos));
  }

  function handleHoraInicio(valor) {
    setForm((atual) => ({ ...atual, horaInicio: valor, horaFim: somarMinutos(valor, DURACAO_PADRAO_MINUTOS) }));
  }

  return (
    <>
      <div className="modal-form__row">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-especialidade`}>{tr('Especialidade')}</label>
          <select id={`${id}-especialidade`} className="input" value={form.especialidadeId} onChange={(e) => set('especialidadeId', e.target.value)}>
            <option value="">{tr('Todas')}</option>
            {especialidades.map((e) => (
              <option key={e._id} value={e._id}>{e.nome}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-profissional`}>{tr('Profissional')}</label>
          <select id={`${id}-profissional`} className="input" value={form.profissionalId} onChange={(e) => set('profissionalId', e.target.value)} required>
            <option value="">{tr('Selecione')}</option>
            {profissionaisFiltrados.map((p) => (
              <option key={p._id} value={p._id}>{p.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {queAcompanham.length > 0 && (
        <div className="agendamento-acompanha" role="group" aria-label={tr('Profissionais que acompanham o paciente')}>
          <span className="agendamento-acompanha__rotulo">{tr('Acompanha:')}</span>
          {queAcompanham.map((p) => (
            <button
              key={p._id}
              type="button"
              className={`agendamento-acompanha__chip${form.profissionalId === p._id ? ' is-ativo' : ''}`}
              aria-pressed={form.profissionalId === p._id}
              onClick={() => escolherProfissional(p)}
            >
              {p.nome}
            </button>
          ))}
        </div>
      )}

      <div className="modal-form__row">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-servico`}>{tr('Serviço')}</label>
          <select id={`${id}-servico`} className="input" value={form.servicoId} onChange={(e) => handleServico(e.target.value)} required>
            <option value="">{tr('Selecione')}</option>
            {servicos.map((s) => (
              <option key={s._id} value={s._id}>{s.nome} ({s.tipo})</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-sala`}>{tr('Sala')}</label>
          <select id={`${id}-sala`} className="input" value={form.salaId} onChange={(e) => set('salaId', e.target.value)} required>
            <option value="">{tr('Selecione')}</option>
            {salas.map((s) => (
              <option key={s._id} value={s._id}>{s.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="agendamento-quando">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-data`}>{tr('Data')}</label>
          <input id={`${id}-data`} className="input" type="date" value={form.data} onChange={(e) => set('data', e.target.value)} required />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-inicio`}>{tr('Início')}</label>
          <input id={`${id}-inicio`} className="input" type="time" value={form.horaInicio} onChange={(e) => handleHoraInicio(e.target.value)} required />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-fim`}>{tr('Fim')}</label>
          <input id={`${id}-fim`} className="input" type="time" value={form.horaFim} onChange={(e) => set('horaFim', e.target.value)} required />
        </div>
      </div>
      {horarioInvalido(form) && <p className="modal-form__hint modal-form__hint--erro">{tr('O horário final precisa ser depois do inicial.')}</p>}

      <div className="field">
        <label className="field__label" htmlFor={`${id}-convenio`}>{tr('Convênio')}</label>
        <select id={`${id}-convenio`} className="input" value={form.convenioId} onChange={(e) => handleConvenio(e.target.value)} required>
          <option value="" disabled>{convenios.length ? tr('Selecione') : tr('Nenhum convênio cadastrado')}</option>
          {convenios.map((c) => (
            <option key={c._id} value={c._id}>{c.nome}</option>
          ))}
        </select>
      </div>
    </>
  );
}
