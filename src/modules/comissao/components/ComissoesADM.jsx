import { useState } from 'react';
import { useComissoesClinica } from '../comissao.hooks';
import { formatarPreco } from '@/modules/servico/servico.utils';
import { formatarData } from '@/modules/assinatura/assinatura.utils';
import { iniciais } from '@/utils/nome';
import { IconeCheck, IconeX } from '@/components/CrudCard/icones';
import PendentesComissaoModal from './PendentesComissaoModal';
import ComissaoKpi from './ComissaoKpi';
import '../comissoes.css';

const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

export default function ComissoesADM() {
  const { resumo, pagamentos, loading, error, successMessage, pagar } = useComissoesClinica();
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [pagandoId, setPagandoId] = useState(null);
  const [detalhesDe, setDetalhesDe] = useState(null);

  const totalPendente = resumo.reduce((soma, linha) => soma + linha.pendente.total, 0);
  const atendimentosPendentes = resumo.reduce((soma, linha) => soma + linha.pendente.quantidade, 0);
  const totalPago = resumo.reduce((soma, linha) => soma + linha.pago.total, 0);

  async function handlePagar(profissionalId) {
    setPagandoId(profissionalId);
    await pagar(profissionalId);
    setPagandoId(null);
    setConfirmandoId(null);
  }

  return (
    <div className="page comissao-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Repasses</h2>
          <p className="page-subtitle">O que cada profissional tem a receber pelos atendimentos realizados</p>
        </div>
      </header>

      {(successMessage || error) && (
        <div className="alerts">
          {error && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <div className="comissao-kpis">
        <ComissaoKpi icone="receita" tom="warning" rotulo="A pagar" valor={formatarPreco(totalPendente)} loading={loading} detalhe="Soma de todos os repasses pendentes" />
        <ComissaoKpi icone="agenda" rotulo="Atendimentos aguardando pagamento" valor={atendimentosPendentes} loading={loading} detalhe="Realizados e ainda não pagos" />
        <ComissaoKpi icone="assinatura" tom="success" rotulo="Já pago" valor={formatarPreco(totalPago)} loading={loading} detalhe="Total de todos os pagamentos feitos" />
      </div>

      <section className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Profissional</th>
              <th>A pagar</th>
              <th>Último pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [0, 1, 2].map((i) => (
                <tr key={i} style={{ '--i': i }}>
                  {[55, 35, 40, 30].map((largura, coluna) => (
                    <td key={coluna}><div className="skeleton skeleton--line" style={{ width: `${largura}%` }} /></td>
                  ))}
                </tr>
              ))
            ) : resumo.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan={4}>Nenhum profissional cadastrado ainda.</td>
              </tr>
            ) : (
              resumo.map(({ profissional, pendente, pago }, index) => {
                const temPendente = pendente.total > 0;
                return (
                  <tr key={profissional._id} style={{ '--i': Math.min(index, 12) }}>
                    <td>
                      <div className="comissao-pessoa">
                        <div className="comissao-pessoa__avatar" aria-hidden="true">{iniciais(profissional.nome)}</div>
                        <div className="comissao-pessoa__dados">
                          <span className="comissao-pessoa__nome">{profissional.nome}</span>
                          {!profissional.temLogin && (
                            <span className="comissao-pessoa__sub" title="Sem um usuário vinculado, o profissional não consegue ver os próprios repasses">Sem login no sistema</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="comissao-valor">
                        <span className="table__num">{formatarPreco(pendente.total)}</span>
                        <span className="comissao-pessoa__sub">
                          {temPendente ? plural(pendente.quantidade, 'atendimento', 'atendimentos') : 'Nada pendente'}
                        </span>
                      </div>
                    </td>
                    <td>
                      {pago.ultimoEm ? (
                        <div className="comissao-valor">
                          <span>{formatarData(pago.ultimoEm)}</span>
                          <span className="comissao-pessoa__sub">{formatarPreco(pago.ultimoValor)}</span>
                        </div>
                      ) : (
                        <span className="comissao-pessoa__sub">Nenhum ainda</span>
                      )}
                    </td>
                    <td>
                      {confirmandoId === profissional._id ? (
                        <div className="comissao-confirmar">
                          <span>Pagar {formatarPreco(pendente.total)}?</span>
                          <button
                            type="button"
                            className="icon-btn comissao-confirmar__ok"
                            aria-label={`Confirmar pagamento de ${formatarPreco(pendente.total)} para ${profissional.nome}`}
                            disabled={pagandoId === profissional._id}
                            onClick={() => handlePagar(profissional._id)}
                          >
                            <IconeCheck />
                          </button>
                          <button type="button" className="icon-btn" aria-label="Cancelar" onClick={() => setConfirmandoId(null)}>
                            <IconeX />
                          </button>
                        </div>
                      ) : (
                        <div className="table__actions">
                          <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            disabled={!temPendente}
                            onClick={() => setDetalhesDe(profissional)}
                          >
                            Ver atendimentos
                          </button>
                          <button
                            type="button"
                            className="btn btn--primary btn--sm"
                            disabled={!temPendente}
                            onClick={() => setConfirmandoId(profissional._id)}
                          >
                            Pagar repasse
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <p className="page-subtitle comissao-nota">
        O repasse nasce quando o atendimento é marcado como realizado na agenda, com o valor que o serviço tem naquele momento.
        Pagar quita de uma vez tudo o que está pendente para o profissional.
      </p>

      <section className="card comissao-historico">
        <h3 className="comissao-historico__titulo">Pagamentos feitos</h3>
        {!loading && pagamentos.length === 0 ? (
          <p className="comissao-pessoa__sub">Nenhum pagamento de repasse registrado ainda.</p>
        ) : (
          <ul className="comissao-historico__lista">
            {pagamentos.map((pagamento) => (
              <li key={pagamento._id} className="comissao-historico__item">
                <div className="comissao-valor">
                  <strong>{pagamento.profissional?.nome ?? 'Profissional removido'}</strong>
                  <span className="comissao-pessoa__sub">
                    {formatarData(pagamento.pagoEm)} · {plural(pagamento.quantidade, 'atendimento', 'atendimentos')}
                    {pagamento.pagoPor ? ` · pago por ${pagamento.pagoPor}` : ''}
                  </span>
                </div>
                <span className="table__num">{formatarPreco(pagamento.valor)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {detalhesDe && (
        <PendentesComissaoModal key={detalhesDe._id} profissional={detalhesDe} onClose={() => setDetalhesDe(null)} />
      )}
    </div>
  );
}
