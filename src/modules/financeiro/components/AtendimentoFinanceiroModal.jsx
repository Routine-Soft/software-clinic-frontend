import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { IconeLixeira, IconeMais } from '@/components/CrudCard/icones';
import { FORMAS_ATENDIMENTO, ROTULO_FORMA, dinheiro, formatarDia } from '../financeiro.utils';
import { tr } from '@/i18n';

// Corrige o lado financeiro de um atendimento: valor, como foi pago e se já foi recebido.
export default function AtendimentoFinanceiroModal({ atendimento, erro, onSalvar, onClose }) {
  const pacote = atendimento.situacao === 'pacote';
  const [valor, setValor] = useState(String(atendimento.valor ?? 0));
  const [formas, setFormas] = useState(() => (atendimento.formas?.length ? atendimento.formas : [{ tipo: 'pix', valor: atendimento.valor }])
    .map((f) => ({ tipo: f.tipo, valor: String(f.valor) })));
  const [recebido, setRecebido] = useState(atendimento.situacao === 'pago' || !!atendimento.pagoEm);

  const soma = formas.reduce((s, f) => s + (Number(f.valor) || 0), 0);
  const diferenca = Math.round((Number(valor) - soma) * 100) / 100;

  function mudarForma(i, campo, novo) {
    setFormas((lista) => lista.map((f, j) => (j === i ? { ...f, [campo]: novo } : f)));
  }

  function adicionarForma() {
    const usadas = new Set(formas.map((f) => f.tipo));
    const tipo = FORMAS_ATENDIMENTO.find((f) => !usadas.has(f)) ?? 'pix';
    setFormas((lista) => [...lista, { tipo, valor: String(Math.max(0, diferenca)) }]);
  }

  function enviar() {
    const corpo = {
      valor: Number(valor),
      formasPagamento: formas.map((f) => ({ tipo: f.tipo, valor: Number(f.valor) || 0 })),
    };
    if (!pacote) corpo.pago = recebido;
    return onSalvar(atendimento._id, corpo);
  }

  return (
    <Modal title={tr('Editar atendimento')} onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={enviar}>
          <p className="atendimento-resumo">
            <strong>{atendimento.paciente ?? tr('Paciente removido')}</strong>
            <span>{[formatarDia(atendimento.data), atendimento.hora, atendimento.servico, atendimento.profissional].filter(Boolean).join(' · ')}</span>
          </p>

          <div className="field">
            <label className="field__label" htmlFor="atd-valor">{tr('Valor do atendimento (R$)')}</label>
            <input id="atd-valor" className="input" type="number" min="0" step="0.01" inputMode="decimal" required value={valor} onChange={(e) => setValor(e.target.value)} />
          </div>

          <div className="atendimento-formas" role="group" aria-labelledby="atd-formas">
            <span id="atd-formas" className="field__label">{tr('Como o paciente pagou')}</span>
            {formas.map((forma, i) => (
              <div key={i} className="atendimento-formas__linha">
                <select className="input" aria-label={tr('Forma de pagamento {p0}', { p0: i + 1 })} value={forma.tipo} onChange={(e) => mudarForma(i, 'tipo', e.target.value)}>
                  {FORMAS_ATENDIMENTO.map((f) => <option key={f} value={f}>{ROTULO_FORMA[f]}</option>)}
                </select>
                <input className="input" type="number" min="0" step="0.01" inputMode="decimal" aria-label={tr('Valor da forma de pagamento {p0}', { p0: i + 1 })} value={forma.valor} onChange={(e) => mudarForma(i, 'valor', e.target.value)} />
                <button type="button" className="icon-btn" aria-label={tr('Remover forma de pagamento {p0}', { p0: i + 1 })} onClick={() => setFormas((lista) => lista.filter((_, j) => j !== i))}>
                  <IconeLixeira />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn--ghost btn--sm atendimento-formas__mais" onClick={adicionarForma}><IconeMais /> {tr('Adicionar forma')}</button>
            {formas.length > 0 && diferenca !== 0 && (
              <p className="financeiro-nota" role="status">
                {diferenca > 0 ? tr('Faltam {p0} para fechar o valor.', { p0: dinheiro(diferenca) }) : tr('As formas passam {p0} do valor.', { p0: dinheiro(-diferenca) })}
              </p>
            )}
          </div>

          {pacote ? (
            <p className="financeiro-nota">{tr('Este atendimento é de um pacote com cobrança à parte: o pagamento é marcado pela parcela, na agenda.')}</p>
          ) : (
            <label className="despesa-opcoes__item despesa-opcoes">
              <input type="checkbox" checked={recebido} onChange={(e) => setRecebido(e.target.checked)} />
              <span>{tr('Pagamento recebido')}</span>
            </label>
          )}

          {atendimento.repasse > 0 && (
            <p className="financeiro-nota">{tr('Se o repasse do profissional for em porcentagem e ainda não foi pago, ele é recalculado com o novo valor.')}</p>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
