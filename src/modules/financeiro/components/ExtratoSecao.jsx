import { useMemo, useState } from 'react';
import { IconeBusca, IconeCheck, IconeLapis, IconeLixeira, IconeMais, IconeX } from '@/components/CrudCard/icones';
import {
  baixarExtratoCsv, descricaoDaLinha, dinheiro, ehLancamento, formatarDia, responsavelDaLinha, ROTULO_CATEGORIA, situacaoDaLinha, textoDaForma,
} from '../financeiro.utils';
import { tr } from '@/i18n';

const POR_PAGINA = 40;
const FILTROS = [['tudo', tr('Tudo')], ['entrada', tr('Entradas')], ['saida', tr('Saídas')]];

function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function detalheDaLinha(l) {
  if (l.origem === 'atendimento') {
    return [l.servico, l.convenio && l.convenio.toLowerCase() !== 'particular' ? tr('Convênio {p0}', { p0: l.convenio }) : null, l.importado ? tr('importado') : null].filter(Boolean).join(' · ');
  }
  if (ehLancamento(l)) return [ROTULO_CATEGORIA[l.categoria] ?? l.categoria, l.fornecedor, l.recorrente ? tr('mensal') : null].filter(Boolean).join(' · ');
  return l.quantidade === 1 ? tr('1 atendimento') : tr('{n} atendimentos', { n: l.quantidade });
}

const PERGUNTA_EXCLUIR = {
  atendimento: tr('Excluir o atendimento? Ele sai da agenda também.'),
  repasse: tr('Desfazer este pagamento? Os atendimentos voltam a ficar pendentes.'),
};

// Editar, pagar/receber e excluir, com a confirmação no próprio lugar.
function AcoesDaLinha({ linha, ocupado, onEditar, onPagar, onExcluir }) {
  const [confirmando, setConfirmando] = useState(false);
  const nome = descricaoDaLinha(linha);

  if (confirmando) {
    return (
      <div className="extrato-acoes extrato-acoes--confirmar">
        <span>{PERGUNTA_EXCLUIR[linha.origem] ?? tr('Excluir?')}</span>
        <button type="button" className="icon-btn icon-btn--danger" disabled={ocupado} aria-label={tr('Confirmar exclusão de {p0}', { p0: nome })} onClick={() => onExcluir(linha, false)}>
          <IconeCheck />
        </button>
        {linha.recorrente && (
          <button type="button" className="btn btn--ghost btn--sm" disabled={ocupado} onClick={() => onExcluir(linha, true)}>{tr('E as próximas')}</button>
        )}
        <button type="button" className="icon-btn" aria-label={tr('Cancelar')} onClick={() => setConfirmando(false)}><IconeX /></button>
      </div>
    );
  }

  const pago = linha.situacao === 'pago';
  return (
    <div className="extrato-acoes">
      {ehLancamento(linha) && (
        <button type="button" className={`btn btn--sm ${pago ? 'btn--ghost' : 'btn--primary'}`} disabled={ocupado} onClick={() => onPagar(linha, !pago)}>
          {pago ? tr('Desfazer') : linha.tipo === 'entrada' ? tr('Receber') : tr('Pagar')}
        </button>
      )}
      {linha.origem !== 'repasse' && (
        <button type="button" className="icon-btn" aria-label={tr('Editar {p0}', { p0: nome })} onClick={() => onEditar(linha)}><IconeLapis /></button>
      )}
      <button type="button" className="icon-btn" aria-label={linha.origem === 'repasse' ? tr('Desfazer pagamento de {p0}', { p0: nome }) : tr('Excluir {p0}', { p0: nome })} onClick={() => setConfirmando(true)}>
        <IconeLixeira />
      </button>
    </div>
  );
}

// Todos os lançamentos do período: atendimentos (entradas), despesas e repasses pagos (saídas).
export default function ExtratoSecao({ extrato, cortado, loading, nomeArquivo, ocupadoId, onNovo, onEditar, onPagar, onExcluir }) {
  const [filtro, setFiltro] = useState('tudo');
  const [busca, setBusca] = useState('');
  const [visiveis, setVisiveis] = useState(POR_PAGINA);

  const linhas = useMemo(() => {
    const termo = normalizar(busca.trim());
    return (extrato ?? []).filter((l) => {
      if (filtro !== 'tudo' && l.tipo !== filtro) return false;
      if (!termo) return true;
      return normalizar([descricaoDaLinha(l), l.servico, l.profissional, l.convenio, l.fornecedor, responsavelDaLinha(l)?.nome].join(' ')).includes(termo);
    });
  }, [extrato, filtro, busca]);

  const entradas = linhas.filter((l) => l.tipo === 'entrada').reduce((s, l) => s + l.valor, 0);
  const saidas = linhas.filter((l) => l.tipo === 'saida').reduce((s, l) => s + l.valor, 0);

  function mudarFiltro(valor) {
    setFiltro(valor);
    setVisiveis(POR_PAGINA);
  }

  return (
    <section className="card financeiro-bloco financeiro-extrato" aria-labelledby="fin-extrato">
      <header className="financeiro-bloco__cab">
        <h3 id="fin-extrato" className="financeiro-bloco__titulo">{tr('Extrato')}</h3>
        <div className="financeiro-bloco__botoes">
          <button type="button" className="btn btn--ghost btn--sm" disabled={loading || linhas.length === 0} onClick={() => baixarExtratoCsv(linhas, nomeArquivo)}>
            {tr('Baixar planilha')}
          </button>
          <button type="button" className="btn btn--primary btn--sm" onClick={onNovo}>
            <IconeMais /> {tr('Novo lançamento')}
          </button>
        </div>
      </header>

      <div className="extrato-ferramentas">
        <div className="filtro-periodo" role="group" aria-label={tr('Tipo de lançamento')}>
          {FILTROS.map(([valor, rotulo]) => (
            <button key={valor} type="button" className="filtro-periodo__btn" aria-pressed={filtro === valor} onClick={() => mudarFiltro(valor)}>{rotulo}</button>
          ))}
        </div>
        <label className="extrato-busca">
          <IconeBusca />
          <input className="input" type="search" placeholder={tr('Buscar paciente, profissional, despesa...')} aria-label={tr('Buscar no extrato')} value={busca} onChange={(e) => { setBusca(e.target.value); setVisiveis(POR_PAGINA); }} />
        </label>
      </div>

      {!loading && (
        <p className="extrato-totais">
          <span>{tr('Entradas')}: <strong className="extrato-valor" data-tipo="entrada">{dinheiro(entradas)}</strong></span>
          <span>{tr('Saídas')}: <strong className="extrato-valor" data-tipo="saida">{dinheiro(saidas)}</strong></span>
          <span>{linhas.length === 1 ? tr('1 lançamento') : tr('{n} lançamentos', { n: linhas.length })}</span>
        </p>
      )}

      {cortado && <p className="alert alert--warning" role="status">{tr('O período tem lançamentos demais: mostrando os mais recentes. Escolha um período menor para ver todos.')}</p>}

      {loading ? (
        <div className="financeiro-carregando" aria-busy="true">
          {[90, 80, 85, 70, 88].map((l, i) => <div key={i} className="skeleton skeleton--line" style={{ width: `${l}%` }} />)}
        </div>
      ) : linhas.length === 0 ? (
        <p className="financeiro-nota">{busca ? tr('Nada encontrado com essa busca.') : tr('Nenhum lançamento neste período.')}</p>
      ) : (
        <>
          <div className="extrato-cabecalho" aria-hidden="true">
            <span>{tr('Data')}</span>
            <span>{tr('Descrição')}</span>
            <span>{tr('Profissional')}</span>
            <span>{tr('Forma')}</span>
            <span>{tr('Situação')}</span>
            <span>{tr('Recebido/pago por')}</span>
            <span className="extrato-cabecalho__valor">{tr('Valor')}</span>
            <span className="extrato-cabecalho__valor">{tr('Ações')}</span>
          </div>
          <ul className="extrato-lista">
            {linhas.slice(0, visiveis).map((l) => {
              const situacao = situacaoDaLinha(l);
              const responsavel = responsavelDaLinha(l);
              return (
                <li key={`${l.origem}-${l._id}`} className="extrato-linha" data-tipo={l.tipo}>
                  <span className="extrato-linha__data">
                    {formatarDia(l.data, { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    {l.hora && <span className="extrato-linha__hora">{l.hora}</span>}
                  </span>
                  <span className="extrato-linha__desc">
                    <strong>{descricaoDaLinha(l)}</strong>
                    <span className="extrato-linha__sub">{detalheDaLinha(l)}</span>
                  </span>
                  <span className="extrato-linha__campo" data-rotulo={tr('Profissional')} data-vazio={ehLancamento(l)}>{ehLancamento(l) ? '—' : l.profissional ?? '—'}</span>
                  <span className="extrato-linha__campo" data-rotulo={tr('Forma')} data-vazio={textoDaForma(l) === '—'}>{textoDaForma(l)}</span>
                  <span className="extrato-linha__campo" data-rotulo={tr('Situação')}><span className={`badge badge--${situacao.tom}`}>{situacao.texto}</span></span>
                  <span className="extrato-linha__campo" data-rotulo={tr('Recebido/pago por')} data-vazio={!responsavel}>
                    {responsavel ? (
                      <>
                        {responsavel.nome}
                        {responsavel.papel && <span className="extrato-linha__sub">{responsavel.papel}</span>}
                      </>
                    ) : '—'}
                  </span>
                  <span className="extrato-linha__valor">
                    <strong className="extrato-valor" data-tipo={l.tipo}>{l.tipo === 'saida' ? '−' : '+'} {dinheiro(l.valor)}</strong>
                    {l.origem === 'atendimento' && l.repasse > 0 && <span className="extrato-linha__sub">{tr('repasse {p0}', { p0: dinheiro(l.repasse) })}</span>}
                  </span>
                  <AcoesDaLinha linha={l} ocupado={ocupadoId === l._id} onEditar={onEditar} onPagar={onPagar} onExcluir={onExcluir} />
                </li>
              );
            })}
          </ul>
          {linhas.length > visiveis && (
            <button type="button" className="btn btn--ghost extrato-mais" onClick={() => setVisiveis((v) => v + POR_PAGINA)}>
              {tr('Mostrar mais ({n} restantes)', { n: linhas.length - visiveis })}
            </button>
          )}
        </>
      )}
    </section>
  );
}
