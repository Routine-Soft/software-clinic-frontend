import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { CATEGORIAS, FORMAS_LANCAMENTO, ROTULO_FORMA, hojeISO } from '../financeiro.utils';
import { tr } from '@/i18n';

const TIPOS = [['receita', tr('Receita (entrada)')], ['despesa', tr('Despesa (saída)')]];

function formInicial(lancamento, tipoInicial) {
  if (lancamento) {
    return {
      tipo: lancamento.origem,
      descricao: lancamento.descricao ?? '',
      valor: String(lancamento.valor ?? ''),
      data: String(lancamento.data).slice(0, 10),
      categoria: lancamento.categoria ?? 'outros',
      fornecedor: lancamento.fornecedor ?? '',
      formaPagamento: lancamento.formaPagamento ?? '',
      observacao: lancamento.observacao ?? '',
      pago: lancamento.situacao === 'pago',
    };
  }
  return {
    tipo: tipoInicial, descricao: '', valor: '', data: hojeISO(), categoria: tipoInicial === 'despesa' ? 'aluguel' : 'convenio',
    fornecedor: '', formaPagamento: '', observacao: '', pago: false, repetir: false, repetirMeses: '12',
  };
}

// Lançar ou editar uma despesa ou uma receita avulsa. No novo dá para repetir todo mês.
export default function LancamentoModal({ lancamento, tipoInicial = 'despesa', erro, onSalvar, onClose }) {
  const editando = !!lancamento;
  const [form, setForm] = useState(() => formInicial(lancamento, tipoInicial));
  const mudar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const despesa = form.tipo === 'despesa';

  function trocarTipo(tipo) {
    setForm((f) => ({ ...f, tipo, categoria: CATEGORIAS[tipo][0][0] }));
  }

  function enviar() {
    const corpo = {
      tipo: form.tipo,
      descricao: form.descricao,
      valor: Number(String(form.valor).replace(',', '.')),
      data: form.data,
      categoria: form.categoria,
      fornecedor: form.fornecedor,
      formaPagamento: form.formaPagamento || null,
      observacao: form.observacao,
      pago: form.pago,
    };
    if (!editando) corpo.repetirMeses = form.repetir ? Number(form.repetirMeses) : 1;
    return onSalvar(corpo, lancamento?._id);
  }

  const titulo = editando ? (despesa ? tr('Editar despesa') : tr('Editar receita')) : tr('Novo lançamento');

  return (
    <Modal title={titulo} onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} submitLabel={editando ? tr('Salvar alterações') : tr('Lançar')} onSubmit={enviar}>
          {!editando && (
            <div className="filtro-periodo lancamento-tipo" role="group" aria-label={tr('Tipo de lançamento')}>
              {TIPOS.map(([valor, rotulo]) => (
                <button key={valor} type="button" className="filtro-periodo__btn" aria-pressed={form.tipo === valor} onClick={() => trocarTipo(valor)}>{rotulo}</button>
              ))}
            </div>
          )}

          <div className="field">
            <label className="field__label" htmlFor="lanc-descricao">{tr('Descrição')}</label>
            <input id="lanc-descricao" className="input" type="text" maxLength={160} required autoFocus placeholder={despesa ? tr('Ex.: Aluguel da sala') : tr('Ex.: Pagamento do convênio de outubro')} value={form.descricao} onChange={(e) => mudar('descricao', e.target.value)} />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="lanc-valor">{tr('Valor (R$)')}</label>
              <input id="lanc-valor" className="input" type="number" min="0.01" step="0.01" inputMode="decimal" required value={form.valor} onChange={(e) => mudar('valor', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="lanc-data">{tr('Data ou vencimento')}</label>
              <input id="lanc-data" className="input" type="date" required value={form.data} onChange={(e) => mudar('data', e.target.value)} />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="lanc-categoria">{tr('Categoria')}</label>
              <select id="lanc-categoria" className="input" value={form.categoria} onChange={(e) => mudar('categoria', e.target.value)}>
                {CATEGORIAS[form.tipo].map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="lanc-forma">{tr('Forma de pagamento')}</label>
              <select id="lanc-forma" className="input" value={form.formaPagamento} onChange={(e) => mudar('formaPagamento', e.target.value)}>
                <option value="">{tr('Não informada')}</option>
                {FORMAS_LANCAMENTO.map((f) => <option key={f} value={f}>{ROTULO_FORMA[f]}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="lanc-fornecedor">{despesa ? tr('Fornecedor ou favorecido (opcional)') : tr('Quem pagou (opcional)')}</label>
            <input id="lanc-fornecedor" className="input" type="text" maxLength={120} value={form.fornecedor} onChange={(e) => mudar('fornecedor', e.target.value)} />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="lanc-obs">{tr('Observação (opcional)')}</label>
            <textarea id="lanc-obs" className="input" rows={2} maxLength={500} value={form.observacao} onChange={(e) => mudar('observacao', e.target.value)} />
          </div>

          <div className="despesa-opcoes">
            <label className="despesa-opcoes__item">
              <input type="checkbox" checked={form.pago} onChange={(e) => mudar('pago', e.target.checked)} />
              <span>{despesa ? tr('Já está paga') : tr('Já foi recebida')}</span>
            </label>
            {!editando && (
              <label className="despesa-opcoes__item">
                <input type="checkbox" checked={form.repetir} onChange={(e) => mudar('repetir', e.target.checked)} />
                <span>{tr('Repetir todo mês (aluguel, salário, sistema...)')}</span>
              </label>
            )}
            {!editando && form.repetir && (
              <div className="field despesa-opcoes__meses">
                <label className="field__label" htmlFor="lanc-meses">{tr('Por quantos meses, contando este?')}</label>
                <input id="lanc-meses" className="input" type="number" min="2" max="24" step="1" required value={form.repetirMeses} onChange={(e) => mudar('repetirMeses', e.target.value)} />
              </div>
            )}
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
