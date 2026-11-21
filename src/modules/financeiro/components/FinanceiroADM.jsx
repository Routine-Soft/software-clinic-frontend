import { useState } from 'react';
import { useDespesas, useFinanceiro } from '../financeiro.hooks';
import { hojeISO } from '../financeiro.utils';
import PeriodoFinanceiro from './PeriodoFinanceiro';
import ResumoFinanceiro from './ResumoFinanceiro';
import { ComoEntrou, ParaOndeFoi } from './ComposicaoFinanceira';
import DespesasSecao from './DespesasSecao';
import DespesaModal from './DespesaModal';
import RepassesSecao from './RepassesSecao';
import ExtratoSecao from './ExtratoSecao';
import { IconeMais } from '@/components/CrudCard/icones';
import '../financeiro.css';
import { tr } from '@/i18n';

// Financeiro da clínica (só a dona): resumo do período, como entrou e para onde foi o dinheiro,
// despesas, repasses aos profissionais e o extrato com todos os lançamentos.
export default function FinanceiroADM() {
  const [filtro, setFiltro] = useState({ periodo: 'mensal', data: hojeISO() });
  const { dados, loading, error, recarregar } = useFinanceiro(filtro.periodo, filtro.data);
  const despesasApi = useDespesas(recarregar);
  const [janela, setJanela] = useState(null); // { despesa } para editar, {} para lançar
  const [ocupadoId, setOcupadoId] = useState(null);

  const despesas = (dados?.extrato ?? []).filter((l) => l.origem === 'despesa');

  function abrirJanela(despesa = null) {
    despesasApi.limparErro();
    setJanela({ despesa });
  }

  async function pagar(despesa, pago) {
    setOcupadoId(despesa._id);
    await despesasApi.pagar(despesa._id, pago);
    setOcupadoId(null);
  }

  async function excluir(despesa, futuras) {
    setOcupadoId(despesa._id);
    await despesasApi.excluir(despesa._id, futuras);
    setOcupadoId(null);
  }

  const mensagemErro = !janela && despesasApi.erro ? despesasApi.erro.message : null;

  return (
    <div className="page financeiro-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Financeiro')}</h2>
          <p className="page-subtitle">{tr('Quanto a clínica faturou, recebeu, gastou e lucrou no período')}</p>
        </div>
        <div className="page-header__acoes">
          <button type="button" className="btn btn--primary" onClick={() => abrirJanela()}>
            <IconeMais /> {tr('Lançar despesa')}
          </button>
        </div>
      </header>

      <PeriodoFinanceiro
        periodo={filtro.periodo}
        data={filtro.data}
        intervalo={dados?.periodo}
        onChange={(periodo, data) => setFiltro({ periodo, data })}
      />

      {(error || mensagemErro || despesasApi.sucesso) && (
        <div className="alerts">
          {error && <p className="alert alert--error" role="alert">{error.message}</p>}
          {mensagemErro && <p className="alert alert--error" role="alert">{mensagemErro}</p>}
          {despesasApi.sucesso && <p className="alert alert--success" role="status">{despesasApi.sucesso}</p>}
        </div>
      )}

      <ResumoFinanceiro resumo={dados?.resumo} periodo={filtro.periodo} loading={loading} />

      <div className="financeiro-grade">
        <ComoEntrou formas={dados?.formasPagamento} faturamento={dados?.resumo?.faturamento} loading={loading} />
        <ParaOndeFoi resumo={dados?.resumo} categorias={dados?.despesasPorCategoria} loading={loading} />
      </div>

      <div className="financeiro-grade">
        <DespesasSecao
          despesas={despesas}
          loading={loading}
          ocupadoId={ocupadoId}
          onNova={() => abrirJanela()}
          onEditar={(d) => abrirJanela(d)}
          onPagar={pagar}
          onExcluir={excluir}
        />
        <RepassesSecao onPago={recarregar} />
      </div>

      <ExtratoSecao
        key={`${filtro.periodo}-${filtro.data}`}
        extrato={dados?.extrato}
        cortado={dados?.extratoCortado}
        loading={loading}
        nomeArquivo={`extrato-${filtro.periodo}-${String(dados?.periodo?.inicio ?? filtro.data).slice(0, 10)}.csv`}
      />

      {janela && (
        <DespesaModal
          despesa={janela.despesa}
          erro={despesasApi.erro}
          onSalvar={despesasApi.salvar}
          onClose={() => setJanela(null)}
        />
      )}
    </div>
  );
}
