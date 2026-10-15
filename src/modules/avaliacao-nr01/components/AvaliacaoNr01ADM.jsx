import { Fragment, useMemo, useState } from 'react';
import { useAvaliacoesNr01 } from '../avaliacao-nr01.hooks';
import { useEmpresas } from '@/modules/empresa/empresa.hooks';
import { usePacientes } from '@/modules/paciente/paciente.hooks';
import { useProfissionais } from '@/modules/profissional/profissional.hooks';
import { useServicos } from '@/modules/servico/servico.hooks';
import { formatDataBR } from '@/utils/date';
import EditarAvaliacaoNr01Modal from './EditarAvaliacaoNr01Modal';
import NovaAvaliacaoNr01Modal from './NovaAvaliacaoNr01Modal';
import NovaEmpresaModal from '@/modules/empresa/components/NovaEmpresaModal';
import { IconeMais, IconeBusca, IconeLapis, IconeLixeira, IconeCheck, IconeX, IconeChevron } from '@/components/CrudCard/icones';
import { RISCOS, riscoDe, ordenarAvaliacoes, contarPorRisco, filtrarAvaliacoes } from '../avaliacao-nr01.utils';
import '../avaliacao-nr01.css';
import { tr } from '@/i18n';

function hojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

const PERGUNTAS_PADRAO = [
  tr('Sobrecarga de trabalho / metas excessivas'),
  tr('Jornada de trabalho excessiva ou inadequada'),
  tr('Assédio moral ou sexual'),
  tr('Conflitos interpessoais na equipe'),
  tr('Falta de autonomia nas atividades'),
  tr('Insegurança no emprego'),
  tr('Comunicação deficiente entre lideranças e equipe'),
];

function respostasPadrao() {
  return PERGUNTAS_PADRAO.map((pergunta) => ({ pergunta, resposta: '' }));
}

const COLUNAS = 5;

const FILTROS_RISCO = [
  ['todas', tr('Todas')],
  ['alto', tr('Alto')],
  ['medio', tr('Médio')],
  ['baixo', tr('Baixo')],
  ['nenhum', tr('Sem classificação')],
];

function BadgeRisco({ risco }) {
  const [rotulo, classe] = RISCOS[risco] ?? [tr('Sem classificação'), ''];
  return <span className={`badge ${classe}`}>{rotulo}</span>;
}

export default function AvaliacaoNr01ADM() {
  const { avaliacoes, loading, error, successMessage, addAvaliacao, editAvaliacao, removeAvaliacao } = useAvaliacoesNr01();
  const { empresas, loading: carregandoEmpresas, error: erroEmpresa, successMessage: sucessoEmpresa, addEmpresa } = useEmpresas();
  const { pacientes } = usePacientes();
  const { profissionais, loading: carregandoProfissionais } = useProfissionais();
  const { servicos } = useServicos();

  const [criandoAvaliacao, setCriandoAvaliacao] = useState(false);
  const [criandoEmpresa, setCriandoEmpresa] = useState(false);
  // Qual das duas fontes gerou o aviso de sucesso mais recente (evita mostrar dois avisos empilhados).
  const [origemAviso, setOrigemAviso] = useState('avaliacao');
  const [avaliacaoEditando, setAvaliacaoEditando] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [expandidoId, setExpandidoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [empresaFiltro, setEmpresaFiltro] = useState('');
  const [riscoFiltro, setRiscoFiltro] = useState('todas');

  const contagem = useMemo(() => contarPorRisco(avaliacoes), [avaliacoes]);
  const avaliacoesFiltradas = useMemo(
    () => filtrarAvaliacoes(ordenarAvaliacoes(avaliacoes), { busca, empresaId: empresaFiltro, risco: riscoFiltro }),
    [avaliacoes, busca, empresaFiltro, riscoFiltro]
  );

  async function handleSalvarCriacao(dados) {
    return await addAvaliacao(dados);
  }

  function handleEdit(avaliacao) {
    setOrigemAviso('avaliacao');
    setConfirmandoId(null);
    setAvaliacaoEditando(avaliacao);
  }

  async function handleSalvarEdicao(id, dados) {
    return await editAvaliacao(id, dados);
  }

  async function handleDelete(id) {
    setOrigemAviso('avaliacao');
    setConfirmandoId(null);
    if (expandidoId === id) setExpandidoId(null);
    await removeAvaliacao(id);
  }

  const algumModalAberto = criandoAvaliacao || criandoEmpresa || !!avaliacaoEditando;
  const avisoSucesso = origemAviso === 'empresa' ? sucessoEmpresa : successMessage;
  const filtrando = busca !== '' || empresaFiltro !== '' || riscoFiltro !== 'todas';

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Avaliações NR-01')}</h2>
          <p className="page-subtitle">{tr('Inventário de riscos psicossociais exigido pela NR-01 para as empresas-cliente')}</p>
        </div>
        <div className="page-header__acoes">
          {!loading && contagem.alto > 0 && (
            <span className="badge badge--danger">{tr('{alto} de risco alto', { alto: contagem.alto })}</span>
          )}
          {!loading && (
            <span className="badge badge--primary">
              {avaliacoes.length} {avaliacoes.length === 1 ? tr('avaliação') : tr('avaliações')}
            </span>
          )}
          <button type="button" className="btn btn--ghost" onClick={() => { setOrigemAviso('empresa'); setCriandoEmpresa(true); }}>
            <IconeMais />
            {tr('Cadastrar empresa')}
          </button>
          <button type="button" className="btn btn--primary" onClick={() => { setOrigemAviso('avaliacao'); setCriandoAvaliacao(true); }}>
            <IconeMais />
            {tr('Nova avaliação')}
          </button>
        </div>
      </header>

      {(avisoSucesso || (error && !algumModalAberto)) && (
        <div className="alerts">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {avisoSucesso && <p className="alert alert--success" role="status">{avisoSucesso}</p>}
        </div>
      )}

      <section className="card nr01-tabela">
        <div className="nr01-toolbar">
          <div className="search">
            <IconeBusca />
            <input
              className="input"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder={tr('Buscar por empresa, funcionário ou profissional')}
              aria-label={tr('Buscar avaliação')}
            />
          </div>

          {empresas.length > 0 && (
            <select
              className="input nr01-toolbar__empresa"
              value={empresaFiltro}
              onChange={(e) => setEmpresaFiltro(e.target.value)}
              aria-label={tr('Filtrar por empresa')}
            >
              <option value="">{tr('Todas as empresas')}</option>
              {empresas.map((empresa) => (
                <option key={empresa._id} value={empresa._id}>{empresa.razaoSocial}</option>
              ))}
            </select>
          )}
        </div>

        <div className="nr01-filtros" role="group" aria-label={tr('Filtrar por classificação de risco')}>
          {FILTROS_RISCO.map(([chave, rotulo]) => (
            <button
              key={chave}
              type="button"
              className="nr01-filtro"
              data-risco={chave}
              aria-pressed={riscoFiltro === chave}
              onClick={() => setRiscoFiltro(chave)}
            >
              {rotulo}
              <span className="nr01-filtro__contagem">{contagem[chave]}</span>
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table className="table nr01-table" aria-busy={loading}>
            <thead>
              <tr>
                <th>{tr('Empresa')}</th>
                <th>{tr('Profissional')}</th>
                <th>{tr('Data')}</th>
                <th>{tr('Risco')}</th>
                <th>{tr('Ações')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [0, 1, 2, 3].map((i) => (
                  <tr key={i} style={{ '--i': i }}>
                    {[65, 45, 35, 30, 30].map((largura, coluna) => (
                      <td key={coluna}>
                        <div className="skeleton skeleton--line" style={{ width: `${largura}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : avaliacoesFiltradas.length === 0 ? (
                <tr>
                  <td className="table__empty" colSpan={COLUNAS}>
                    {avaliacoes.length === 0
                      ? tr('Nenhuma avaliação cadastrada ainda.')
                      : filtrando ? tr('Nenhuma avaliação encontrada para esse filtro.') : tr('Nenhuma avaliação.')}
                  </td>
                </tr>
              ) : (
                avaliacoesFiltradas.map((avaliacao, index) => {
                  const expandido = expandidoId === avaliacao._id;
                  const risco = riscoDe(avaliacao);
                  const temDetalhes = avaliacao.respostas?.length > 0 || !!avaliacao.recomendacoes;
                  return (
                    <Fragment key={avaliacao._id}>
                      <tr
                        style={{ '--i': Math.min(index, 12) }}
                        className={avaliacaoEditando?._id === avaliacao._id ? 'is-editing' : undefined}
                        data-risco={risco}
                      >
                        <td>
                          <div className="nr01-empresa">
                            <button
                              type="button"
                              className="nr01-expandir"
                              aria-expanded={expandido}
                              aria-label={tr('{p0} detalhes da avaliação de {p1}', { p0: expandido ? tr('Recolher') : tr('Ver'), p1: avaliacao.empresaId?.razaoSocial ?? 'empresa' })}
                              onClick={() => setExpandidoId(expandido ? null : avaliacao._id)}
                            >
                              <IconeChevron />
                            </button>
                            <div className="nr01-empresa__dados">
                              <strong className="nr01-empresa__nome">{avaliacao.empresaId?.razaoSocial ?? '—'}</strong>
                              <span className="nr01-empresa__sub">
                                {avaliacao.pacienteId?.nome ? tr('Funcionário: {nome}', { nome: avaliacao.pacienteId.nome }) : tr('Avaliação geral da empresa')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{avaliacao.profissionalId?.nome ?? '—'}</td>
                        <td className="nowrap">{formatDataBR(avaliacao.data) ?? '—'}</td>
                        <td><BadgeRisco risco={risco} /></td>
                        <td>
                          {confirmandoId === avaliacao._id ? (
                            <div className="nr01-confirmar">
                              <span>{tr('Excluir?')}</span>
                              <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar exclusão da avaliação')} onClick={() => handleDelete(avaliacao._id)}>
                                <IconeCheck />
                              </button>
                              <button type="button" className="icon-btn" aria-label={tr('Cancelar exclusão')} onClick={() => setConfirmandoId(null)}>
                                <IconeX />
                              </button>
                            </div>
                          ) : (
                            <div className="table__actions">
                              <button type="button" className="icon-btn" aria-label={tr('Editar avaliação')} title={tr('Editar')} onClick={() => handleEdit(avaliacao)}>
                                <IconeLapis />
                              </button>
                              <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Excluir avaliação')} title={tr('Excluir')} onClick={() => setConfirmandoId(avaliacao._id)}>
                                <IconeLixeira />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {expandido && (
                        <tr className="nr01-detalhe">
                          <td colSpan={COLUNAS}>
                            <div className="nr01-detalhe__conteudo">
                            {!temDetalhes && <p className="nr01-detalhe__vazio">{tr('Nenhum fator de risco ou recomendação registrados.')}</p>}

                            {avaliacao.respostas?.length > 0 && (
                              <div className="nr01-detalhe__bloco">
                                <h4>{tr('Fatores de risco avaliados')}</h4>
                                <ul className="nr01-fatores">
                                  {avaliacao.respostas.map((item, i) => (
                                    <li key={i}>
                                      <span>{item.pergunta}</span>
                                      <strong className={item.resposta ? undefined : 'is-vazio'}>{item.resposta || tr('Sem observação')}</strong>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {avaliacao.recomendacoes && (
                              <div className="nr01-detalhe__bloco">
                                <h4>{tr('Recomendações / plano de ação')}</h4>
                                <p>{avaliacao.recomendacoes}</p>
                              </div>
                            )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {avaliacaoEditando && (
        <EditarAvaliacaoNr01Modal
          key={avaliacaoEditando._id}
          avaliacao={avaliacaoEditando}
          empresas={empresas}
          pacientes={pacientes}
          profissionais={profissionais}
          servicos={servicos}
          carregando={carregandoEmpresas || carregandoProfissionais}
          perguntasPadrao={respostasPadrao()}
          hoje={hojeISO()}
          erro={error}
          onSave={handleSalvarEdicao}
          onClose={() => setAvaliacaoEditando(null)}
        />
      )}

      {criandoEmpresa && (
        <NovaEmpresaModal
          erro={erroEmpresa}
          onSave={addEmpresa}
          onClose={() => setCriandoEmpresa(false)}
        />
      )}

      {criandoAvaliacao && (
        <NovaAvaliacaoNr01Modal
          empresas={empresas}
          pacientes={pacientes}
          profissionais={profissionais}
          servicos={servicos}
          carregando={carregandoEmpresas || carregandoProfissionais}
          perguntasPadrao={respostasPadrao()}
          hoje={hojeISO()}
          erro={error}
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoAvaliacao(false)}
        />
      )}
    </div>
  );
}
