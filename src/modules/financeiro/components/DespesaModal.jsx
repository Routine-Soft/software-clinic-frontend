import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { CATEGORIAS_DESPESA, FORMAS_DESPESA, ROTULO_FORMA, hojeISO } from '../financeiro.utils';
import { tr } from '@/i18n';

function formInicial(despesa) {
  if (despesa) {
    return {
      descricao: despesa.descricao ?? '',
      valor: String(despesa.valor ?? ''),
      data: String(despesa.data).slice(0, 10),
      categoria: despesa.categoria ?? 'outros',
      fornecedor: despesa.fornecedor ?? '',
      formaPagamento: despesa.formaPagamento ?? '',
      observacao: despesa.observacao ?? '',
    };
  }
  return { descricao: '', valor: '', data: hojeISO(), categoria: 'aluguel', fornecedor: '', formaPagamento: '', observacao: '', pago: false, repetir: false, repetirMeses: '12' };
}

// Lançar ou editar uma despesa. Na despesa nova dá para marcar como já paga e repetir todo mês.
export default function DespesaModal({ despesa, erro, onSalvar, onClose }) {
  const editando = !!despesa;
  const [form, setForm] = useState(() => formInicial(despesa));
  const mudar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function enviar() {
    const corpo = {
      descricao: form.descricao,
      valor: Number(String(form.valor).replace(',', '.')),
      data: form.data,
      categoria: form.categoria,
      fornecedor: form.fornecedor,
      formaPagamento: form.formaPagamento || null,
      observacao: form.observacao,
    };
    if (!editando) {
      corpo.pago = form.pago;
      corpo.repetirMeses = form.repetir ? Number(form.repetirMeses) : 1;
    }
    return onSalvar(corpo, despesa?._id);
  }

  return (
    <Modal title={editando ? tr('Editar despesa') : tr('Lançar despesa')} onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} submitLabel={editando ? tr('Salvar alterações') : tr('Lançar despesa')} onSubmit={enviar}>
          <div className="field">
            <label className="field__label" htmlFor="despesa-descricao">{tr('Descrição')}</label>
            <input id="despesa-descricao" className="input" type="text" maxLength={160} required autoFocus placeholder={tr('Ex.: Aluguel da sala')} value={form.descricao} onChange={(e) => mudar('descricao', e.target.value)} />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="despesa-valor">{tr('Valor (R$)')}</label>
              <input id="despesa-valor" className="input" type="number" min="0.01" step="0.01" inputMode="decimal" required value={form.valor} onChange={(e) => mudar('valor', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="despesa-data">{tr('Data ou vencimento')}</label>
              <input id="despesa-data" className="input" type="date" required value={form.data} onChange={(e) => mudar('data', e.target.value)} />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="despesa-categoria">{tr('Categoria')}</label>
              <select id="despesa-categoria" className="input" value={form.categoria} onChange={(e) => mudar('categoria', e.target.value)}>
                {CATEGORIAS_DESPESA.map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="despesa-forma">{tr('Forma de pagamento')}</label>
              <select id="despesa-forma" className="input" value={form.formaPagamento} onChange={(e) => mudar('formaPagamento', e.target.value)}>
                <option value="">{tr('Não informada')}</option>
                {FORMAS_DESPESA.map((f) => <option key={f} value={f}>{ROTULO_FORMA[f]}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="despesa-fornecedor">{tr('Fornecedor ou favorecido (opcional)')}</label>
            <input id="despesa-fornecedor" className="input" type="text" maxLength={120} value={form.fornecedor} onChange={(e) => mudar('fornecedor', e.target.value)} />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="despesa-obs">{tr('Observação (opcional)')}</label>
            <textarea id="despesa-obs" className="input" rows={2} maxLength={500} value={form.observacao} onChange={(e) => mudar('observacao', e.target.value)} />
          </div>

          {!editando && (
            <div className="despesa-opcoes">
              <label className="despesa-opcoes__item">
                <input type="checkbox" checked={form.pago} onChange={(e) => mudar('pago', e.target.checked)} />
                <span>{tr('Já está paga')}</span>
              </label>
              <label className="despesa-opcoes__item">
                <input type="checkbox" checked={form.repetir} onChange={(e) => mudar('repetir', e.target.checked)} />
                <span>{tr('Repetir todo mês (aluguel, salário, sistema...)')}</span>
              </label>
              {form.repetir && (
                <div className="field despesa-opcoes__meses">
                  <label className="field__label" htmlFor="despesa-meses">{tr('Por quantos meses, contando este?')}</label>
                  <input id="despesa-meses" className="input" type="number" min="2" max="24" step="1" required value={form.repetirMeses} onChange={(e) => mudar('repetirMeses', e.target.value)} />
                </div>
              )}
            </div>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
