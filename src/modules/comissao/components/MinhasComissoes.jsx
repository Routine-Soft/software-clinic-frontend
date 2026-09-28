import { useState } from 'react';
import { useMinhasComissoes } from '../comissao.hooks';
import { formatarPreco } from '@/modules/servico/servico.utils';
import { formatarData } from '@/modules/assinatura/assinatura.utils';
import { formatDataBR } from '@/utils/date';
import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import FiltroPeriodo from '@/components/FiltroPeriodo/FiltroPeriodo';
import { ROTULO_PERIODO } from '@/components/FiltroPeriodo/periodos';
import ComissaoKpi from './ComissaoKpi';
import '../comissoes.css';

const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

export default function MinhasComissoes() {
  const [periodo, setPeriodo] = useState('mensal');
  const { dados, loading, error } = useMinhasComissoes(periodo);
  const rotuloPeriodo = ROTULO_PERIODO[periodo];

  if (!loading && dados && !dados.vinculado) {
    return (
      <div className="page comissao-page">
        <header className="page-header">
          <div>
            <h2 className="page-title">Minhas comissões</h2>
          </div>
        </header>
        <section className="card comissao-vazio">
          <Icone>{ICONES.receita}</Icone>
          <p>
            Seu login ainda não está vinculado a um cadastro de profissional. Peça ao administrador da clínica para
            vincular o seu usuário no cadastro de profissionais.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="page comissao-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Minhas comissões</h2>
          <p className="page-subtitle">{dados?.profissional?.nome ?? 'Comissões pelos atendimentos que você realizou'}</p>
        </div>
        <div className="page-header__acoes">
          <FiltroPeriodo valor={periodo} onChange={setPeriodo} rotulo="Período dos atendimentos" />
        </div>
      </header>

      {error && (
        <div className="alerts">
          <p className="alert alert--error" role="alert">{error.message}</p>
        </div>
      )}

      <div className="comissao-kpis">
        <ComissaoKpi
          icone="receita"
          tom="warning"
          rotulo="A receber"
          valor={formatarPreco(dados?.aReceber?.total)}
          loading={loading}
          detalhe={dados?.aReceber?.quantidade
            ? `${plural(dados.aReceber.quantidade, 'atendimento', 'atendimentos')} aguardando pagamento da clínica`
            : 'Nada pendente no momento'}
        />
        <ComissaoKpi
          icone="agenda"
          rotulo={`Atendimentos ${rotuloPeriodo}`}
          valor={dados?.noPeriodo?.atendimentos ?? 0}
          loading={loading}
          detalhe="Marcados como realizados"
        />
        <ComissaoKpi
          icone="assinatura"
          tom="success"
          rotulo={`Comissão ${rotuloPeriodo}`}
          valor={formatarPreco(dados?.noPeriodo?.comissao)}
          loading={loading}
          detalhe={`${formatarPreco(dados?.noPeriodo?.recebida)} já recebido`}
        />
      </div>

      <section className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Paciente</th>
              <th>Serviço</th>
              <th>Comissão</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [0, 1, 2].map((i) => (
                <tr key={i} style={{ '--i': i }}>
                  {[30, 50, 40, 25, 25].map((largura, coluna) => (
                    <td key={coluna}><div className="skeleton skeleton--line" style={{ width: `${largura}%` }} /></td>
                  ))}
                </tr>
              ))
            ) : !dados?.atendimentos?.length ? (
              <tr>
                <td className="table__empty" colSpan={5}>Nenhum atendimento realizado {rotuloPeriodo}.</td>
              </tr>
            ) : (
              dados.atendimentos.map((item, index) => (
                <tr key={item._id} style={{ '--i': Math.min(index, 12) }}>
                  <td className="nowrap">{formatDataBR(item.data)} · {item.horaInicio}</td>
                  <td>{item.paciente ?? '—'}</td>
                  <td>{item.servico ?? '—'}</td>
                  <td className="table__num">{item.comissao > 0 ? formatarPreco(item.comissao) : '—'}</td>
                  <td>
                    {item.comissao <= 0
                      ? <span className="badge">Sem comissão</span>
                      : item.paga
                        ? <span className="badge badge--success">Recebida</span>
                        : <span className="badge badge--warning">A receber</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {dados?.pagamentos?.length > 0 && (
        <section className="card comissao-historico">
          <h3 className="comissao-historico__titulo">Últimos pagamentos recebidos</h3>
          <ul className="comissao-historico__lista">
            {dados.pagamentos.map((pagamento) => (
              <li key={pagamento._id} className="comissao-historico__item">
                <div className="comissao-valor">
                  <strong>{formatarData(pagamento.pagoEm)}</strong>
                  <span className="comissao-pessoa__sub">{plural(pagamento.quantidade, 'atendimento', 'atendimentos')}</span>
                </div>
                <span className="table__num">{formatarPreco(pagamento.valor)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
