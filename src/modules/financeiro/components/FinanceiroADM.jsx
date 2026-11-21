import { useState } from 'react';
import { useAcoesFinanceiro, useFinanceiro } from '../financeiro.hooks';
import { ehLancamento, hojeISO } from '../financeiro.utils';
import PeriodoFinanceiro from './PeriodoFinanceiro';
import ResumoFinanceiro from './ResumoFinanceiro';
import { ComoEntrou, ParaOndeFoi } from './ComposicaoFinanceira';
import DespesasSecao from './DespesasSecao';
import LancamentoModal from './LancamentoModal';
import AtendimentoFinanceiroModal from './AtendimentoFinanceiroModal';
import RepassesSecao from './RepassesSecao';
import ExtratoSecao from './ExtratoSecao';
import { IconeMais } from '@/components/CrudCard/icones';
import '../financeiro.css';
import { tr } from '@/i18n';

// Financeiro da clínica (só a dona): resumo do período, como entrou e para onde foi o dinheiro,
// despesas, repasses aos profissionais e o extrato, onde ela cria, edita e apaga qualquer lançamento.
export default function FinanceiroADM() {
  const [filtro, setFiltro] = useState({ periodo: 'mensal', data: hojeISO() });
  const { dados, loading, error, recarregar } = useFinanceiro(filtro.periodo, filtro.data);
  const acoes = useAcoesFinanceiro(recarregar);
  // { tipo: 'lancamento', linha?, tipoInicial } ou { tipo: 'atendimento', linha }
  const [janela, setJanela] = useState(null);
  const [ocupadoId, setOcupadoId] = useState(null);
  // Desfazer um repasse pelo extrato muda a lista de repasses: a seção recarrega com uma chave nova.
  const [versaoRepasses, setVersaoRepasses] = useState(0);

  const despesas = (dados?.extrato ?? []).filter((l) => l.origem === 'despesa');

  function abrir(novaJanela) {
    acoes.limparErro();
    setJanela(novaJanela);
  }

  const novoLancamento = (tipoInicial = 'despesa') => abrir({ tipo: 'lancamento', tipoInicial });

  function editar(linha) {
    abrir(ehLancamento(linha) ? { tipo: 'lancamento', linha } : { tipo: 'atendimento', linha });
  }

  async function comOcupado(linha, acao) {
    setOcupadoId(linha._id);
    await acao();
    setOcupadoId(null);
  }

  const pagar = (linha, pago) => comOcupado(linha, () => acoes.pagarLancamento(linha._id, pago));

  function excluir(linha, futuras) {
    return comOcupado(linha, () => {
      if (linha.origem === 'atendimento') return acoes.excluirAtendimento(linha._id);
      if (linha.origem === 'repasse') {
        return acoes.desfazerRepasse(linha._id).then((ok) => { if (ok) setVersaoRepasses((v) => v + 1); });
      }
      return acoes.excluirLancamento(linha._id, futuras);
    });
  }

  const mensagemErro = !janela && acoes.erro ? acoes.erro.message : null;

  return (
    <div className="page financeiro-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Financeiro')}</h2>
          <p className="page-subtitle">{tr('Quanto a clínica faturou, recebeu, gastou e lucrou no período')}</p>
        </div>
        <div className="page-header__acoes">
          <button type="button" className="btn btn--primary" onClick={() => novoLancamento('receita')}>
            <IconeMais /> {tr('Novo lançamento')}
          </button>
        </div>
      </header>

      <PeriodoFinanceiro
        periodo={filtro.periodo}
        data={filtro.data}
        intervalo={dados?.periodo}
        onChange={(periodo, data) => setFiltro({ periodo, data })}
      />

      {(error || mensagemErro || acoes.sucesso) && (
        <div className="alerts">
          {error && <p className="alert alert--error" role="alert">{error.message}</p>}
          {mensagemErro && <p className="alert alert--error" role="alert">{mensagemErro}</p>}
          {acoes.sucesso && <p className="alert alert--success" role="status">{acoes.sucesso}</p>}
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
          onNova={() => novoLancamento('despesa')}
          onEditar={editar}
          onPagar={pagar}
          onExcluir={excluir}
        />
        <RepassesSecao key={versaoRepasses} onPago={recarregar} />
      </div>

      <ExtratoSecao
        key={`${filtro.periodo}-${filtro.data}`}
        extrato={dados?.extrato}
        cortado={dados?.extratoCortado}
        loading={loading}
        nomeArquivo={`extrato-${filtro.periodo}-${String(dados?.periodo?.inicio ?? filtro.data).slice(0, 10)}.csv`}
        ocupadoId={ocupadoId}
        onNovo={() => novoLancamento('receita')}
        onEditar={editar}
        onPagar={pagar}
        onExcluir={excluir}
      />

      {janela?.tipo === 'lancamento' && (
        <LancamentoModal
          lancamento={janela.linha}
          tipoInicial={janela.tipoInicial}
          erro={acoes.erro}
          onSalvar={acoes.salvarLancamento}
          onClose={() => setJanela(null)}
        />
      )}
      {janela?.tipo === 'atendimento' && (
        <AtendimentoFinanceiroModal
          atendimento={janela.linha}
          erro={acoes.erro}
          onSalvar={acoes.editarAtendimento}
          onClose={() => setJanela(null)}
        />
      )}
    </div>
  );
}
