import { useEffect, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import FiltroPeriodo from '@/components/FiltroPeriodo/FiltroPeriodo';
import { formatarPreco } from '@/modules/assinatura/assinatura.utils';
import { getMetricasAdmin } from '../clinica-admin.api';
import { localeAtual, tr } from '@/i18n';

const TIPO_SERVICO = { consulta: tr('Consulta'), pacote: tr('Pacote') };

// Ordem das formas de pagamento no relatório. As duas últimas só aparecem quando têm valor.
const FORMAS = [
  ['pix', tr('Pix')],
  ['dinheiro', tr('Dinheiro')],
  ['cartao_credito', tr('Cartão de crédito')],
  ['cartao_debito', tr('Cartão de débito')],
  ['outras', tr('Outras formas')],
  ['semForma', tr('Sem forma registrada')],
];

function numero(valor) {
  return Number(valor ?? 0).toLocaleString(localeAtual());
}

// 'AAAA-MM' -> "Nov/25" (mês no idioma da tela).
function rotuloDoMes(mes) {
  const [ano, m] = String(mes).split('-').map(Number);
  if (!ano || !m) return mes;
  const nome = new Date(ano, m - 1, 1).toLocaleDateString(localeAtual(), { month: 'short' }).replace('.', '');
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)}/${String(ano).slice(-2)}`;
}

function Numero({ rotulo, valor, detalhe, tom }) {
  return (
    <div className="clinica-numero" data-tom={tom}>
      <strong>{valor}</strong>
      <span>{rotulo}</span>
      {detalhe && <span className="relatorio__detalhe">{detalhe}</span>}
    </div>
  );
}

function textoAtendimentos(qtd) {
  return qtd === 1 ? tr('1 atendimento') : tr('{n} atendimentos', { n: numero(qtd) });
}

// Faturamento mês a mês, em barras deitadas (cabe bem no celular).
function GraficoMeses({ meses }) {
  const maximo = Math.max(1, ...meses.map((m) => m.faturamento ?? 0));
  return (
    <ul className="relatorio-meses">
      {meses.map((m) => (
        <li key={m.mes} className="relatorio-meses__item">
          <span className="relatorio-meses__mes">{rotuloDoMes(m.mes)}</span>
          <span className="relatorio-meses__trilho" aria-hidden="true">
            <span className="relatorio-meses__barra" style={{ '--parte': `${((m.faturamento ?? 0) / maximo) * 100}%` }} />
          </span>
          <strong className="relatorio-meses__valor">{formatarPreco(m.faturamento)}</strong>
          <span className="relatorio-meses__info">{textoAtendimentos(m.atendimentos ?? 0)} · {tr('repasse {p0}', { p0: formatarPreco(m.repasse) })}</span>
        </li>
      ))}
    </ul>
  );
}

// Quanto entrou em cada forma de pagamento no período, em barras deitadas.
function FormasPagamento({ formas, faturamento }) {
  const linhas = FORMAS.filter(([chave], i) => i < 4 || (formas?.[chave] ?? 0) > 0);
  const total = Math.max(1, faturamento ?? 0);
  return (
    <>
      <ul className="relatorio-formas">
        {linhas.map(([chave, rotulo]) => {
          const valor = formas?.[chave] ?? 0;
          return (
            <li key={chave} className="relatorio-formas__item" data-forma={chave}>
              <span className="relatorio-formas__nome">{rotulo}</span>
              <span className="relatorio-meses__trilho" aria-hidden="true">
                <span className="relatorio-formas__barra" style={{ '--parte': `${Math.min(100, (valor / total) * 100)}%` }} />
              </span>
              <strong className="relatorio-meses__valor">{formatarPreco(valor)}</strong>
            </li>
          );
        })}
      </ul>
      {(formas?.semForma ?? 0) > 0 && (
        <p className="relatorio__detalhe">{tr('Sem forma registrada: convênio pago pelo plano, pacote com cobrança à parte ou consulta importada.')}</p>
      )}
    </>
  );
}

// Relatório da clínica para o super admin: quanto fatura, quanto repassa, quem mais atende e os preços dos serviços.
export default function RelatorioClinicaModal({ admin, onClose }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [periodo, setPeriodo] = useState('mensal');

  useEffect(() => {
    let ignore = false;
    getMetricasAdmin(admin._id)
      .then((response) => { if (!ignore) setDados(response.data); })
      .catch((err) => { if (!ignore) setErro(err); });
    return () => { ignore = true; };
  }, [admin._id]);

  const fat = dados?.faturamento;
  const profissoes = dados?.profissoes ?? [];
  const servicos = dados?.servicos ?? [];
  const meses = fat?.meses ?? [];
  const doPeriodo = fat?.periodos?.[periodo];
  const repasse = profissoes.reduce(
    (soma, p) => ({ total: soma.total + (p.repasse ?? 0), pago: soma.pago + (p.repassePago ?? 0), pendente: soma.pendente + (p.repassePendente ?? 0) }),
    { total: 0, pago: 0, pendente: 0 },
  );

  return (
    <Modal title={tr('Relatório · {nomeEmpresa}', { nomeEmpresa: admin.nomeEmpresa })} wide onClose={onClose}>
      {() => (
        <div className="clinica-detalhes relatorio">
          {erro ? (
            <p className="alert alert--error" role="alert">{erro.message}</p>
          ) : !dados ? (
            <div className="relatorio__carregando" aria-busy="true">
              <div className="skeleton skeleton--line" style={{ width: '70%' }} />
              <div className="skeleton skeleton--line" style={{ width: '50%' }} />
              <div className="skeleton skeleton--line" style={{ width: '60%' }} />
            </div>
          ) : (
            <>
              <section aria-label={tr('Faturamento')}>
                <div className="relatorio__cabecalho">
                  <h4 className="clinica-detalhes__titulo">{tr('Faturamento')}</h4>
                  <FiltroPeriodo valor={periodo} onChange={setPeriodo} rotulo={tr('Período do faturamento')} />
                </div>
                <div className="clinica-numeros">
                  <Numero rotulo={tr('Faturamento')} valor={formatarPreco(doPeriodo?.faturamento)} detalhe={textoAtendimentos(doPeriodo?.atendimentos ?? 0)} tom="success" />
                  <Numero rotulo={tr('Ticket médio')} valor={formatarPreco(doPeriodo?.ticketMedio)} detalhe={tr('por atendimento')} tom="info" />
                  <Numero rotulo={tr('Repasse')} valor={formatarPreco(doPeriodo?.repasse)} detalhe={tr('para os profissionais')} />
                </div>
                <h5 className="relatorio__subtitulo">{tr('Como foi pago')}</h5>
                {(doPeriodo?.atendimentos ?? 0) === 0 ? (
                  <p className="clinica-detalhes__vazio">{tr('Nenhum atendimento realizado neste período.')}</p>
                ) : (
                  <FormasPagamento formas={doPeriodo?.formasPagamento} faturamento={doPeriodo?.faturamento} />
                )}
                <p className="clinica-detalhes__vazio">
                  {tr('Desde o início: {p0} em {p1}, com {p2} de repasse.', { p0: formatarPreco(fat?.total?.faturamento), p1: textoAtendimentos(fat?.total?.atendimentos ?? 0), p2: formatarPreco(fat?.total?.repasse) })}
                </p>
              </section>

              <section aria-label={tr('Últimos 12 meses')}>
                <h4 className="clinica-detalhes__titulo">{tr('Últimos 12 meses')}</h4>
                {meses.length === 0 ? (
                  <p className="clinica-detalhes__vazio">{tr('Nenhum atendimento realizado ainda.')}</p>
                ) : (
                  <GraficoMeses meses={meses} />
                )}
              </section>

              <section aria-label={tr('Por profissão')}>
                <h4 className="clinica-detalhes__titulo">{tr('Por profissão')}</h4>
                {profissoes.length === 0 ? (
                  <p className="clinica-detalhes__vazio">{tr('Nenhum profissional com atendimento ainda.')}</p>
                ) : (
                  <div className="table-wrap">
                    <table className="table relatorio-tabela">
                      <thead>
                        <tr>
                          <th>{tr('Profissão')}</th>
                          <th>{tr('Profissionais')}</th>
                          <th>{tr('Realizados')}</th>
                          <th>{tr('Agendados')}</th>
                          <th>{tr('Faltas')}</th>
                          <th>{tr('Cancelados')}</th>
                          <th>{tr('Por profissional')}</th>
                          <th>{tr('Ticket médio')}</th>
                          <th>{tr('Faturamento')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profissoes.map((p) => (
                          <tr key={p.profissao}>
                            <td className="relatorio-tabela__nome">{tr(p.profissao)}</td>
                            <td className="table__num">{numero(p.profissionais)}</td>
                            <td className="table__num">{numero(p.atendimentos?.realizados)}</td>
                            <td className="table__num">{numero(p.atendimentos?.agendados)}</td>
                            <td className="table__num">{numero(p.atendimentos?.faltas)}</td>
                            <td className="table__num">{numero(p.atendimentos?.cancelados)}</td>
                            <td className="table__num">{numero(Math.round((p.atendimentosPorProfissional ?? 0) * 10) / 10)}</td>
                            <td className="table__num">{formatarPreco(p.ticketMedio)}</td>
                            <td className="table__num">{formatarPreco(p.faturamento)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {profissoes.length > 0 && (
                <section aria-label={tr('Repasse aos profissionais')}>
                  <h4 className="clinica-detalhes__titulo">{tr('Repasse aos profissionais')}</h4>
                  <div className="clinica-numeros">
                    <Numero rotulo={tr('Repasse total')} valor={formatarPreco(repasse.total)} />
                    <Numero rotulo={tr('Já pago')} valor={formatarPreco(repasse.pago)} tom="success" />
                    <Numero rotulo={tr('Pendente')} valor={formatarPreco(repasse.pendente)} tom="danger" />
                  </div>
                  <ul className="relatorio-repasse">
                    {profissoes.map((p) => {
                      const total = (p.repassePago ?? 0) + (p.repassePendente ?? 0);
                      const pago = total > 0 ? ((p.repassePago ?? 0) / total) * 100 : 0;
                      return (
                        <li key={p.profissao} className="relatorio-repasse__item">
                          <span className="relatorio-repasse__nome">{tr(p.profissao)}</span>
                          <span className="relatorio-repasse__trilho" aria-hidden="true">
                            <span className="relatorio-repasse__pago" style={{ '--parte': `${pago}%` }} />
                          </span>
                          <span className="relatorio-repasse__valores">
                            {tr('{p0} pago · {p1} pendente', { p0: formatarPreco(p.repassePago), p1: formatarPreco(p.repassePendente) })}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              <section aria-label={tr('Preços dos serviços')}>
                <h4 className="clinica-detalhes__titulo">{tr('Preços dos serviços')}</h4>
                {servicos.length === 0 ? (
                  <p className="clinica-detalhes__vazio">{tr('Nenhum serviço cadastrado.')}</p>
                ) : (
                  <div className="table-wrap">
                    <table className="table relatorio-tabela">
                      <thead>
                        <tr>
                          <th>{tr('Serviço')}</th>
                          <th>{tr('Tipo')}</th>
                          <th>{tr('Preço de tabela')}</th>
                          <th>{tr('Preço médio cobrado')}</th>
                          <th>{tr('Atendimentos')}</th>
                          <th>{tr('Faturamento')}</th>
                          <th>{tr('Repasse')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servicos.map((s, i) => (
                          <tr key={`${s.nome}-${i}`}>
                            <td className="relatorio-tabela__nome">{s.nome}</td>
                            <td>{TIPO_SERVICO[s.tipo] ?? s.tipo}</td>
                            <td className="table__num">{formatarPreco(s.precoTabela)}</td>
                            <td className="table__num">{s.atendimentos > 0 ? formatarPreco(s.precoMedioCobrado) : '—'}</td>
                            <td className="table__num">{numero(s.atendimentos)}</td>
                            <td className="table__num">{formatarPreco(s.faturamento)}</td>
                            <td className="table__num">{formatarPreco(s.repasse)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
