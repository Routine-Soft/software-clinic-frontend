import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import { dinheiro, textoVariacao } from '../financeiro.utils';
import { tr } from '@/i18n';

const plural = (n, um, varios) => (n === 1 ? um : varios.replace('{n}', n));

function Kpi({ icone, tom, rotulo, valor, detalhe, variacao, alerta, loading, i }) {
  return (
    <article className="card financeiro-kpi" data-tom={tom} style={{ '--i': i }}>
      <div className="financeiro-kpi__topo">
        <span className="financeiro-kpi__icone" aria-hidden="true"><Icone>{ICONES[icone]}</Icone></span>
        <span className="financeiro-kpi__rotulo">{rotulo}</span>
      </div>
      {loading ? (
        <span className="skeleton skeleton--line financeiro-kpi__skeleton" />
      ) : (
        <>
          <strong className="financeiro-kpi__valor">{valor}</strong>
          {detalhe && <span className="financeiro-kpi__detalhe">{detalhe}</span>}
          {variacao && <span className="financeiro-kpi__variacao" data-positiva={variacao.positiva}>{variacao.texto}</span>}
          {alerta && <span className="financeiro-kpi__alerta">{alerta}</span>}
        </>
      )}
    </article>
  );
}

// Os números do período: o que entrou, o que saiu e o que sobrou.
export default function ResumoFinanceiro({ resumo, periodo, loading }) {
  const r = resumo ?? {};
  const lucroNegativo = (r.lucro ?? 0) < 0;

  return (
    <section className="financeiro-kpis" aria-label={tr('Resumo do período')}>
      <Kpi
        i={0} icone="receita" tom="primary" rotulo={tr('Faturamento')} loading={loading}
        valor={dinheiro(r.faturamento)}
        detalhe={tr('{p0} · ticket médio {p1}', { p0: plural(r.atendimentos ?? 0, tr('1 atendimento'), tr('{n} atendimentos')), p1: dinheiro(r.ticketMedio) })}
        variacao={textoVariacao(r.faturamento ?? 0, r.anterior?.faturamento, periodo)}
      />
      <Kpi
        i={1} icone="assinatura" tom="success" rotulo={tr('Recebido')} loading={loading}
        valor={dinheiro(r.recebido?.total)}
        detalhe={plural(r.recebido?.quantidade ?? 0, tr('1 pagamento registrado no período'), tr('{n} pagamentos registrados no período'))}
      />
      <Kpi
        i={2} icone="espera" tom="warning" rotulo={tr('A receber')} loading={loading}
        valor={dinheiro(r.aReceber?.total)}
        detalhe={plural(r.aReceber?.quantidade ?? 0, tr('1 atendimento sem pagamento'), tr('{n} atendimentos sem pagamento'))}
      />
      <Kpi
        i={3} icone="cancelado" tom="danger" rotulo={tr('Despesas')} loading={loading}
        valor={dinheiro(r.despesas?.total)}
        detalhe={tr('{p0} pagas · {p1} a pagar', { p0: dinheiro(r.despesas?.pagas), p1: dinheiro(r.despesas?.aPagar) })}
        alerta={r.despesas?.vencidas ? plural(r.despesas.vencidas, tr('1 despesa vencida'), tr('{n} despesas vencidas')) : null}
      />
      <Kpi
        i={4} icone="profissionais" tom="violet" rotulo={tr('Repasses')} loading={loading}
        valor={dinheiro(r.repasse?.total)}
        detalhe={tr('{p0} pagos · {p1} pendentes', { p0: dinheiro(r.repasse?.pago), p1: dinheiro(r.repasse?.pendente) })}
      />
      <Kpi
        i={5} icone="painel" tom={lucroNegativo ? 'danger' : 'success'} rotulo={lucroNegativo ? tr('Prejuízo') : tr('Lucro')} loading={loading}
        valor={dinheiro(r.lucro)}
        detalhe={r.margem == null ? tr('Faturamento − repasses − despesas') : tr('Margem de {p0}%', { p0: String(r.margem).replace('.', ',') })}
        variacao={textoVariacao(r.lucro ?? 0, r.anterior?.lucro, periodo)}
      />
    </section>
  );
}
