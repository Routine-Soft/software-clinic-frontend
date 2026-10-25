import { useId } from 'react';
import { IconeMais, IconeX } from '@/components/CrudCard/icones';
import { FORMAS_PAGAMENTO, redistribuir, somaDasFormas } from '../agendamento.form';
import { formatarPreco } from '@/modules/servico/servico.utils';
import { tr } from '@/i18n';

// Total, formas de pagamento (divididas igualmente ao incluir ou tirar uma; dá para ajustar à mão) e "gratuito".
// Usado na 2ª etapa do novo agendamento e na edição.
export default function FormaPagamentoCampos({ form, setForm }) {
  const id = useId();
  const { financeiro } = form;
  const total = Number(financeiro.valor) || 0;
  const soma = somaDasFormas(financeiro.formasPagamento);
  const diferenca = Math.round((total - soma) * 100) / 100;

  function setFinanceiro(mudancas) {
    setForm((atual) => ({ ...atual, financeiro: { ...atual.financeiro, ...mudancas } }));
  }

  // Mudar o total redistribui o novo valor entre as formas escolhidas.
  function handleTotal(valor) {
    setForm((atual) => ({ ...atual, financeiro: { ...atual.financeiro, valor, formasPagamento: redistribuir(atual.financeiro.formasPagamento, valor) } }));
  }

  function handleGratuito(gratuito) {
    setForm((atual) => {
      const formas = atual.financeiro.formasPagamento;
      const formasPagamento = gratuito || formas.length ? formas : redistribuir([{ tipo: 'pix' }], atual.financeiro.valor);
      return { ...atual, financeiro: { ...atual.financeiro, gratuito, formasPagamento } };
    });
  }

  function setForma(index, campo, valor) {
    const formasPagamento = [...financeiro.formasPagamento];
    formasPagamento[index] = { ...formasPagamento[index], [campo]: valor };
    setFinanceiro({ formasPagamento });
  }

  // A forma nova é uma que ainda não está na lista (se houver).
  function adicionarForma() {
    const usadas = new Set(financeiro.formasPagamento.map((f) => f.tipo));
    const tipo = FORMAS_PAGAMENTO.find(([valor]) => !usadas.has(valor))?.[0] ?? 'pix';
    setFinanceiro({ formasPagamento: redistribuir([...financeiro.formasPagamento, { tipo }], financeiro.valor) });
  }

  function removerForma(index) {
    setFinanceiro({ formasPagamento: redistribuir(financeiro.formasPagamento.filter((_, i) => i !== index), financeiro.valor) });
  }

  function percentual(valor) {
    if (!total) return '';
    return `${Math.round(((Number(valor) || 0) / total) * 100)}%`;
  }

  return (
    <div className="pagamento">
      <label className={`pagamento-gratuito${financeiro.gratuito ? ' is-ativo' : ''}`}>
        <input type="checkbox" checked={financeiro.gratuito} onChange={(e) => handleGratuito(e.target.checked)} />
        <span>
          <strong>{tr('Não será cobrado')}</strong>
          <small>{tr('Serviço gratuito: a consulta fica registrada sem valor.')}</small>
        </span>
      </label>

      {!financeiro.gratuito && (
        <>
          <div className="pagamento-total">
            <div className="field">
              <label className="field__label" htmlFor={`${id}-valor`}>{tr('Total a pagar (R$)')}</label>
              <input id={`${id}-valor`} className="input pagamento-total__input" type="number" min="0" step="0.01" inputMode="decimal" value={financeiro.valor} onChange={(e) => handleTotal(e.target.value)} required />
              <p className="modal-form__hint">{tr('Já vem com o preço do serviço para o convênio escolhido. Pode mudar.')}</p>
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${id}-venc`}>{tr('Vencimento')}</label>
              <input id={`${id}-venc`} className="input" type="date" value={financeiro.vencimento} onChange={(e) => setFinanceiro({ vencimento: e.target.value })} required />
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${id}-parcelas`}>{tr('Parcelas')}</label>
              <input id={`${id}-parcelas`} className="input" type="number" min="1" value={financeiro.parcelamento} onChange={(e) => setFinanceiro({ parcelamento: e.target.value })} />
            </div>
          </div>

          <div className="pagamento-formas" role="group" aria-labelledby={`${id}-formas`}>
            <span id={`${id}-formas`} className="field__label">{tr('Como o paciente vai pagar')}</span>

            {financeiro.formasPagamento.map((forma, index) => (
              <div className="pagamento-forma" key={index} style={{ '--i': index }}>
                <select className="input" aria-label={tr('Forma de pagamento {p0}', { p0: index + 1 })} value={forma.tipo} onChange={(e) => setForma(index, 'tipo', e.target.value)}>
                  {FORMAS_PAGAMENTO.map(([valor, rotulo]) => (
                    <option key={valor} value={valor}>{rotulo}</option>
                  ))}
                </select>
                <input className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder={tr('Valor')} aria-label={tr('Valor da forma de pagamento {p0}', { p0: index + 1 })} value={forma.valor} onChange={(e) => setForma(index, 'valor', e.target.value)} />
                <span className="pagamento-forma__pct" aria-hidden="true">{percentual(forma.valor)}</span>
                {financeiro.formasPagamento.length > 1 ? (
                  <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Remover forma de pagamento {p0}', { p0: index + 1 })} onClick={() => removerForma(index)}>
                    <IconeX />
                  </button>
                ) : <span className="pagamento-forma__vago" />}
              </div>
            ))}

            <div className="pagamento-formas__rodape">
              <button type="button" className="btn btn--ghost btn--sm" onClick={adicionarForma}>
                <IconeMais />
                {financeiro.formasPagamento.length ? tr('Dividir em outra forma') : tr('Forma de pagamento')}
              </button>

              {financeiro.formasPagamento.length > 0 && (
                diferenca === 0 ? (
                  <span className="pagamento-soma is-ok" role="status">{tr('Soma certa: {valor}', { valor: formatarPreco(soma) })}</span>
                ) : (
                  <span className="pagamento-soma is-erro" role="status">
                    {diferenca > 0
                      ? tr('Faltam {valor} para fechar o total', { valor: formatarPreco(diferenca) })
                      : tr('Passou {valor} do total', { valor: formatarPreco(-diferenca) })}
                  </span>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
