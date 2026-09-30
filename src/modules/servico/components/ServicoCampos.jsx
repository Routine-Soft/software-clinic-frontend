import { useId } from 'react';
import { IconeMais, IconeLixeira } from '@/components/CrudCard/icones';
import { dicaComissao } from '../servico.utils';
import { linhaConvenioVazia } from '../servico.form';
import '../servico.css';

function CampoComissao({ id, tipo, valor, preco, onTipo, onValor }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>Comissão do profissional</label>
      <div className="comissao-campo">
        <div className="comissao-campo__tipo" role="group" aria-label="Tipo de comissão">
          <button type="button" aria-pressed={tipo === 'valor'} onClick={() => onTipo('valor')}>R$</button>
          <button type="button" aria-pressed={tipo === 'percentual'} onClick={() => onTipo('percentual')}>%</button>
        </div>
        <input
          id={id}
          className="input"
          type="number"
          min="0"
          max={tipo === 'percentual' ? 100 : (preco || undefined)}
          step="0.01"
          value={valor}
          placeholder="0"
          onChange={(e) => onValor(e.target.value)}
          aria-describedby={`${id}-dica`}
        />
      </div>
      <p id={`${id}-dica`} className="field__hint">{dicaComissao(preco, valor, tipo)}</p>
    </div>
  );
}

function CampoPreco({ id, valor, onChange, rotulo = 'Preço' }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{rotulo}</label>
      <div className="input-group">
        <span className="input-group__prefix">R$</span>
        <input id={id} className="input" type="number" min="0" step="0.01" value={valor} onChange={(e) => onChange(e.target.value)} required />
      </div>
    </div>
  );
}

// Campos de criar e editar serviço: dados básicos, preço/comissão particular e a tabela por convênio.
export default function ServicoCampos({ form, setForm, convenios }) {
  const id = useId();

  const set = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const setLinha = (index, campo, valor) => setForm((atual) => ({
    ...atual,
    tabelaConvenios: atual.tabelaConvenios.map((linha, i) => (i === index ? { ...linha, [campo]: valor } : linha)),
  }));
  const adicionarLinha = () => setForm((atual) => ({ ...atual, tabelaConvenios: [...atual.tabelaConvenios, linhaConvenioVazia()] }));
  const removerLinha = (index) => setForm((atual) => ({ ...atual, tabelaConvenios: atual.tabelaConvenios.filter((_, i) => i !== index) }));

  const usados = new Set(form.tabelaConvenios.map((l) => l.convenioId).filter(Boolean));
  const podeAdicionar = convenios.length > form.tabelaConvenios.length;

  return (
    <>
      <div className="field">
        <label className="field__label" htmlFor={`${id}-nome`}>Nome</label>
        <input id={`${id}-nome`} className="input" type="text" value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Ex: Consulta de rotina, Pacote de fisioterapia" required />
      </div>

      <div className="modal-form__row">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-tipo`}>Tipo</label>
          <select id={`${id}-tipo`} className="input" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
            <option value="consulta">Consulta</option>
            <option value="pacote">Pacote</option>
          </select>
        </div>

        {form.tipo === 'pacote' && (
          <div className="field field--reveal">
            <label className="field__label" htmlFor={`${id}-dias`}>Quantidade de dias</label>
            <input id={`${id}-dias`} className="input" type="number" min="1" value={form.qtdDias} onChange={(e) => set('qtdDias', e.target.value)} required />
          </div>
        )}
      </div>

      <section className="tabela-preco" aria-label="Preços e comissões">
        <h4 className="tabela-preco__titulo">Preços e comissões</h4>
        <p className="field__hint">
          {form.tipo === 'pacote' ? 'A comissão vale por sessão realizada. ' : ''}
          Convênio que não estiver na lista usa o preço e a comissão do particular.
        </p>

        <div className="tabela-preco__linha">
          <span className="tabela-preco__nome">Particular</span>
          <div className="modal-form__row">
            <CampoPreco id={`${id}-preco`} valor={form.preco} onChange={(v) => set('preco', v)} />
            <CampoComissao
              id={`${id}-comissao`}
              tipo={form.comissaoTipo}
              valor={form.comissao}
              preco={form.preco}
              onTipo={(v) => set('comissaoTipo', v)}
              onValor={(v) => set('comissao', v)}
            />
          </div>
        </div>

        {form.tabelaConvenios.map((linha, index) => (
          <div className="tabela-preco__linha" key={index}>
            <div className="tabela-preco__cab">
              <select
                className="input tabela-preco__convenio"
                value={linha.convenioId}
                onChange={(e) => setLinha(index, 'convenioId', e.target.value)}
                aria-label={`Convênio da linha ${index + 1}`}
                required
              >
                <option value="">Escolha o convênio</option>
                {convenios.map((c) => (
                  <option key={c._id} value={c._id} disabled={usados.has(c._id) && c._id !== linha.convenioId}>{c.nome}</option>
                ))}
              </select>
              <button type="button" className="icon-btn icon-btn--danger" aria-label={`Remover linha ${index + 1}`} title="Remover" onClick={() => removerLinha(index)}>
                <IconeLixeira />
              </button>
            </div>
            <div className="modal-form__row">
              <CampoPreco id={`${id}-preco-${index}`} valor={linha.preco} onChange={(v) => setLinha(index, 'preco', v)} />
              <CampoComissao
                id={`${id}-comissao-${index}`}
                tipo={linha.comissaoTipo}
                valor={linha.comissao}
                preco={linha.preco}
                onTipo={(v) => setLinha(index, 'comissaoTipo', v)}
                onValor={(v) => setLinha(index, 'comissao', v)}
              />
            </div>
          </div>
        ))}

        {convenios.length === 0 ? (
          <p className="modal-form__hint">Para ter preço e comissão por convênio, cadastre os convênios antes (card Convênios, passo 4 do Dashboard admin).</p>
        ) : (
          <button type="button" className="btn btn--ghost btn--sm tabela-preco__adicionar" onClick={adicionarLinha} disabled={!podeAdicionar}>
            <IconeMais />
            {podeAdicionar ? 'Adicionar convênio' : 'Todos os convênios já estão na tabela'}
          </button>
        )}
      </section>
    </>
  );
}
