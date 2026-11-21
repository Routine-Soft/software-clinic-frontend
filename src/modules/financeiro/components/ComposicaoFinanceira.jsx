import { dinheiro, ROTULO_CATEGORIA, ROTULO_FORMA } from '../financeiro.utils';
import { tr } from '@/i18n';

// As quatro primeiras sempre aparecem; as outras só quando têm valor no período.
const FORMAS = [
  ['pix', ROTULO_FORMA.pix],
  ['dinheiro', ROTULO_FORMA.dinheiro],
  ['cartao_credito', ROTULO_FORMA.cartao_credito],
  ['cartao_debito', ROTULO_FORMA.cartao_debito],
  ['convenio', tr('Convênio (pago pelo plano)')],
  ['pacote', tr('Pacote com cobrança à parte')],
  ['outras', tr('Outras formas')],
  ['semForma', tr('Sem forma registrada')],
];

function Barras({ linhas, total }) {
  const base = Math.max(1, total);
  return (
    <ul className="financeiro-barras">
      {linhas.map(({ chave, rotulo, valor, tom }) => (
        <li key={chave} className="financeiro-barras__item" data-tom={tom}>
          <span className="financeiro-barras__nome">{rotulo}</span>
          <span className="financeiro-barras__trilho" aria-hidden="true">
            <span className="financeiro-barras__barra" style={{ '--parte': `${Math.min(100, (valor / base) * 100)}%` }} />
          </span>
          <strong className="financeiro-barras__valor">{dinheiro(valor)}</strong>
        </li>
      ))}
    </ul>
  );
}

function Carregando() {
  return (
    <div className="financeiro-carregando" aria-busy="true">
      {[70, 55, 62, 40].map((largura) => <div key={largura} className="skeleton skeleton--line" style={{ width: `${largura}%` }} />)}
    </div>
  );
}

// Como o faturamento do período foi pago (forma registrada no agendamento).
export function ComoEntrou({ formas, faturamento, loading }) {
  const linhas = FORMAS
    .filter(([chave], i) => i < 4 || (formas?.[chave] ?? 0) > 0)
    .map(([chave, rotulo]) => ({ chave, rotulo, valor: formas?.[chave] ?? 0, tom: chave }));

  return (
    <section className="card financeiro-bloco" aria-labelledby="fin-entrou">
      <header className="financeiro-bloco__cab">
        <h3 id="fin-entrou" className="financeiro-bloco__titulo">{tr('Como entrou')}</h3>
        <span className="financeiro-bloco__total">{dinheiro(faturamento)}</span>
      </header>
      {loading ? <Carregando /> : <Barras linhas={linhas} total={faturamento ?? 0} />}
      {!loading && (formas?.semForma ?? 0) > 0 && (
        <p className="financeiro-nota">{tr('Sem forma registrada: atendimento agendado sem a forma de pagamento ou importado de outro sistema.')}</p>
      )}
    </section>
  );
}

// Para onde foi o faturamento: repasses, despesas por categoria e o que sobrou.
export function ParaOndeFoi({ resumo, categorias, loading }) {
  const faturamento = resumo?.faturamento ?? 0;
  const repasse = resumo?.repasse?.total ?? 0;
  const despesas = resumo?.despesas?.total ?? 0;
  const lucro = resumo?.lucro ?? 0;
  const base = Math.max(1, faturamento, repasse + despesas);
  const partes = [
    { chave: 'repasse', valor: repasse, rotulo: tr('Repasses') },
    { chave: 'despesas', valor: despesas, rotulo: tr('Despesas') },
    { chave: 'lucro', valor: Math.max(0, lucro), rotulo: tr('Lucro') },
  ];
  const linhas = [
    { chave: 'repasse', rotulo: tr('Repasses aos profissionais'), valor: repasse, tom: 'repasse' },
    ...(categorias ?? []).map((c) => ({ chave: c.categoria, rotulo: ROTULO_CATEGORIA[c.categoria] ?? c.categoria, valor: c.total, tom: 'despesa' })),
  ];

  return (
    <section className="card financeiro-bloco" aria-labelledby="fin-foi">
      <header className="financeiro-bloco__cab">
        <h3 id="fin-foi" className="financeiro-bloco__titulo">{tr('Para onde foi')}</h3>
        <span className="financeiro-bloco__total">{dinheiro(repasse + despesas)}</span>
      </header>
      {loading ? <Carregando /> : (
        <>
          <div className="financeiro-divisao" role="img" aria-label={partes.map((p) => `${p.rotulo}: ${dinheiro(p.valor)}`).join(', ')}>
            {partes.filter((p) => p.valor > 0).map((p) => (
              <span key={p.chave} className="financeiro-divisao__parte" data-tom={p.chave} style={{ '--parte': `${(p.valor / base) * 100}%` }} />
            ))}
          </div>
          <ul className="financeiro-legenda">
            {partes.map((p) => (
              <li key={p.chave} data-tom={p.chave}>
                <span className="financeiro-legenda__ponto" aria-hidden="true" />
                {p.rotulo} <strong>{faturamento > 0 ? `${Math.round((p.valor / faturamento) * 100)}%` : '—'}</strong>
              </li>
            ))}
          </ul>
          {linhas.every((l) => !l.valor) ? (
            <p className="financeiro-nota">{tr('Nenhuma saída neste período.')}</p>
          ) : (
            <Barras linhas={linhas.filter((l) => l.valor > 0)} total={repasse + despesas} />
          )}
        </>
      )}
    </section>
  );
}
