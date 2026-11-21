import { useState } from 'react';
import { IconeCheck, IconeLapis, IconeLixeira, IconeMais, IconeX, Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import { dinheiro, formatarDia, ROTULO_CATEGORIA, situacaoDaLinha } from '../financeiro.utils';
import { tr } from '@/i18n';

function Linha({ despesa, onEditar, onPagar, onExcluir, ocupado }) {
  const [confirmando, setConfirmando] = useState(false);
  const situacao = situacaoDaLinha(despesa);
  const paga = despesa.situacao === 'pago';

  return (
    <li className="despesa-item">
      <div className="despesa-item__info">
        <span className="despesa-item__nome">{despesa.descricao}</span>
        <span className="despesa-item__sub">
          {formatarDia(despesa.data, { day: '2-digit', month: '2-digit' })} · {ROTULO_CATEGORIA[despesa.categoria] ?? despesa.categoria}
          {despesa.fornecedor ? ` · ${despesa.fornecedor}` : ''}
          {despesa.recorrente ? ` · ${tr('mensal')}` : ''}
        </span>
      </div>
      <div className="despesa-item__valor">
        <strong>{dinheiro(despesa.valor)}</strong>
        <span className={`badge badge--${situacao.tom}`}>{situacao.texto}</span>
      </div>
      {confirmando ? (
        <div className="despesa-item__acoes despesa-item__confirmar">
          <span>{tr('Excluir?')}</span>
          <button type="button" className="icon-btn icon-btn--danger" disabled={ocupado} aria-label={tr('Confirmar exclusão de {p0}', { p0: despesa.descricao })} onClick={() => onExcluir(despesa, false)}>
            <IconeCheck />
          </button>
          {despesa.recorrente && (
            <button type="button" className="btn btn--ghost btn--sm" disabled={ocupado} onClick={() => onExcluir(despesa, true)}>{tr('E as próximas')}</button>
          )}
          <button type="button" className="icon-btn" aria-label={tr('Cancelar')} onClick={() => setConfirmando(false)}><IconeX /></button>
        </div>
      ) : (
        <div className="despesa-item__acoes">
          <button type="button" className={`btn btn--sm ${paga ? 'btn--ghost' : 'btn--primary'}`} disabled={ocupado} onClick={() => onPagar(despesa, !paga)}>
            {paga ? tr('Desfazer') : tr('Pagar')}
          </button>
          <button type="button" className="icon-btn" aria-label={tr('Editar {p0}', { p0: despesa.descricao })} onClick={() => onEditar(despesa)}><IconeLapis /></button>
          <button type="button" className="icon-btn" aria-label={tr('Excluir {p0}', { p0: despesa.descricao })} onClick={() => setConfirmando(true)}><IconeLixeira /></button>
        </div>
      )}
    </li>
  );
}

// Despesas lançadas no período, com pagar, editar e excluir no próprio lugar.
export default function DespesasSecao({ despesas, loading, ocupadoId, onNova, onEditar, onPagar, onExcluir }) {
  return (
    <section className="card financeiro-bloco" aria-labelledby="fin-despesas">
      <header className="financeiro-bloco__cab">
        <h3 id="fin-despesas" className="financeiro-bloco__titulo">{tr('Despesas do período')}</h3>
        <button type="button" className="btn btn--primary btn--sm" onClick={onNova}>
          <IconeMais /> {tr('Lançar despesa')}
        </button>
      </header>
      {loading ? (
        <div className="financeiro-carregando" aria-busy="true">
          {[80, 65, 72].map((l) => <div key={l} className="skeleton skeleton--line" style={{ width: `${l}%` }} />)}
        </div>
      ) : despesas.length === 0 ? (
        <div className="financeiro-vazio">
          <span className="financeiro-vazio__icone" aria-hidden="true"><Icone>{ICONES.receita}</Icone></span>
          <p>{tr('Nenhuma despesa neste período. Lance aluguel, salários, materiais e contas para ver o lucro de verdade.')}</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onNova}>{tr('Lançar a primeira despesa')}</button>
        </div>
      ) : (
        <ul className="despesa-lista">
          {despesas.map((d) => (
            <Linha key={d._id} despesa={d} ocupado={ocupadoId === d._id} onEditar={onEditar} onPagar={onPagar} onExcluir={onExcluir} />
          ))}
        </ul>
      )}
    </section>
  );
}
