import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../paciente.hooks';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { useEmpresas } from '@/modules/empresa/empresa.hooks';
import { filtrarPacientes, ordenarPacientes, contatoDoPaciente, rotuloDoResponsavel, cpfDoPaciente, nomesQueAcompanham, textoIdadeCompleta } from '../paciente.utils';
import { useProfissionais } from '@/modules/profissional/profissional.hooks';
import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import AcompanhamentosModal from './AcompanhamentosModal';
import { formatDataBR } from '@/utils/date';
import { iniciais } from '@/utils/nome';
import { IconeBusca, IconeLapis, IconeLixeira, IconeCheck, IconeX, IconeFicha, IconeMais, IconeAbrirJanela } from '@/components/CrudCard/icones';
import EditarPacienteModal from './EditarPacienteModal';
import NovoPacienteModal from './NovoPacienteModal';
import { useTodosProntuarios, useAcessoProntuario } from '@/modules/prontuario/prontuario.hooks';
import { atendimentoEmAndamento, idDoPaciente, formatDataInstanteBR } from '@/modules/prontuario/prontuario.utils';
import ProntuarioModal from '@/modules/prontuario/components/ProntuarioModal';
import './paciente.css';
import '@/modules/prontuario/prontuario.css';
import SeloTeste from './SeloTeste';
import { tr } from '@/i18n';

// Pacientes e prontuários na mesma tela. Consultas e o botão do prontuário só aparecem para quem
// pode abrir prontuários (profissional de saúde); a recepção vê o cadastro, sem nada clínico.
export default function PacienteADM() {
  const { pacientes, loading, error, successMessage, addPaciente, editPaciente, removePaciente, incluirAcompanhamento, finalizarAcompanhamento, refreshPacientes } = usePacientes();
  const { profissionais } = useProfissionais();
  const { convenios } = useConvenios();
  const { empresas } = useEmpresas();
  const acesso = useAcessoProntuario();
  const veProntuarios = !!acesso.profissional;
  const { prontuarios, loading: carregandoProntuarios, refresh: refreshProntuarios } = useTodosProntuarios(veProntuarios);
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [criandoPaciente, setCriandoPaciente] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [pacienteAcompanhamento, setPacienteAcompanhamento] = useState(null);
  const [pacienteEmJanela, setPacienteEmJanela] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);

  const pacientesFiltrados = useMemo(
    () => filtrarPacientes(ordenarPacientes(pacientes), busca),
    [pacientes, busca]
  );

  const resumoPorPaciente = useMemo(() => {
    const mapa = new Map();
    for (const prontuario of prontuarios) {
      const id = idDoPaciente(prontuario);
      const atual = mapa.get(id) ?? { ultima: null, total: 0, emAtendimento: false };
      if (!atual.ultima || new Date(prontuario.createdAt) > new Date(atual.ultima)) atual.ultima = prontuario.createdAt;
      atual.total += 1;
      if (atendimentoEmAndamento(prontuario)) atual.emAtendimento = true;
      mapa.set(id, atual);
    }
    return mapa;
  }, [prontuarios]);

  const emAtendimento = useMemo(
    () => [...resumoPorPaciente.values()].filter((r) => r.emAtendimento).length,
    [resumoPorPaciente]
  );

  function handleEdit(paciente) {
    setConfirmandoId(null);
    setPacienteEditando(paciente);
  }

  async function handleDelete(id) {
    setConfirmandoId(null);
    await removePaciente(id);
  }

  function fecharProntuario() {
    setPacienteEmJanela(null);
    refreshProntuarios();
    refreshPacientes();
  }

  const carregando = loading || acesso.carregando || (veProntuarios && carregandoProntuarios);
  const larguras = veProntuarios ? [70, 55, 50, 40, 30] : [70, 55, 50, 30];
  const algumModalAberto = criandoPaciente || !!pacienteEditando || !!pacienteAcompanhamento;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Pacientes')}</h2>
          <p className="page-subtitle">
            {veProntuarios
              ? tr('Cadastro, prontuário e histórico de atendimentos de cada paciente')
              : tr('Cadastro e consulta dos pacientes da clínica')}
          </p>
        </div>
        <div className="page-header__acoes">
          {!carregando && emAtendimento > 0 && (
            <span className="badge badge--live">{tr('{emAtendimento} em atendimento', { emAtendimento })}</span>
          )}
          {!loading && (
            <span className="badge badge--primary">
              {pacientes.length} {pacientes.length === 1 ? tr('paciente') : tr('pacientes')}
            </span>
          )}
          <button type="button" className="btn btn--primary" onClick={() => setCriandoPaciente(true)}>
            <IconeMais />
            {tr('Novo paciente')}
          </button>
        </div>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <section className="card paciente-tabela">
        <div className="paciente-toolbar">
          <div className="search">
            <IconeBusca />
            <input
              className="input"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder={tr('Buscar por nome, CPF, telefone ou e-mail')}
              aria-label={tr('Buscar paciente')}
            />
          </div>
          {!loading && busca && (
            <span className="paciente-toolbar__contagem">
              {pacientesFiltrados.length} de {pacientes.length}
            </span>
          )}
        </div>

        <div className="table-wrap">
          <table className="table paciente-table" aria-busy={carregando}>
            <thead>
              <tr>
                <th>{tr('Paciente')}</th>
                <th>{tr('Contato')}</th>
                <th>{tr('Convênio e acompanhamento')}</th>
                {veProntuarios && <th>{tr('Consultas')}</th>}
                <th>{tr('Ações')}</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                [0, 1, 2, 3].map((i) => (
                  <tr key={i} style={{ '--i': i }}>
                    {larguras.map((largura, coluna) => (
                      <td key={coluna}>
                        <div className="skeleton skeleton--line" style={{ width: `${largura}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pacientesFiltrados.length === 0 ? (
                <tr>
                  <td className="table__empty" colSpan={larguras.length}>
                    {pacientes.length === 0 ? tr('Nenhum paciente cadastrado ainda.') : tr('Nenhum paciente encontrado para essa busca.')}
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((paciente, index) => {
                  const contato = contatoDoPaciente(paciente);
                  const responsaveis = paciente.responsaveis ?? [];
                  const acompanham = nomesQueAcompanham(paciente, profissionais);
                  const idade = textoIdadeCompleta(paciente.dataNascimento);
                  const resumo = resumoPorPaciente.get(paciente._id);
                  return (
                    <tr
                      key={paciente._id}
                      style={{ '--i': Math.min(index, 12) }}
                      className={pacienteEditando?._id === paciente._id ? 'is-editing' : undefined}
                    >
                      <td>
                        <div className="pessoa">
                          <div className="pessoa__avatar" aria-hidden="true">{iniciais(paciente.nome)}</div>
                          <div className="pessoa__dados">
                            {veProntuarios ? (
                              <button type="button" className="pessoa__nome paciente-nome-link" onClick={() => setPacienteEmJanela(paciente)}>
                                {paciente.nome}
                              </button>
                            ) : (
                              <strong className="pessoa__nome">{paciente.nome}</strong>
                            )}
                            <span className="pessoa__sub nowrap">{cpfDoPaciente(paciente)} <SeloTeste paciente={paciente} /></span>
                            {paciente.dataNascimento && (
                              <span className="pessoa__sub">
                                {formatDataBR(paciente.dataNascimento)}
                                {idade && <> · {idade}</>}
                              </span>
                            )}
                            {responsaveis.length > 0 && (
                              <span className="pessoa__resp">{tr('Resp.: {p0}', { p0: responsaveis.map(rotuloDoResponsavel).join(', ') })}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="pessoa__dados pessoa__dados--contato">
                          <span className="nowrap">{contato.telefone || '—'}</span>
                          <span className="pessoa__sub pessoa__sub--corta" title={contato.email}>{contato.email}</span>
                          <span
                            className={`badge paciente-whats${paciente.aceitaWhatsapp ? ' badge--success' : ''}`}
                            title={paciente.aceitaWhatsapp ? tr('Aceita receber lembretes de consulta pelo WhatsApp') : tr('Não aceitou receber lembretes pelo WhatsApp')}
                          >
                            {paciente.aceitaWhatsapp ? tr('Lembretes no WhatsApp') : tr('Sem lembretes no WhatsApp')}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="paciente-vinculos">
                          {paciente.convenioId?.nome
                            ? <span className="badge badge--info">{paciente.convenioId.nome}</span>
                            : <span className="badge">{tr('Sem convênio')}</span>}
                          {paciente.empresaId?.razaoSocial && (
                            <span className="badge badge--primary paciente-vinculos__empresa" title={paciente.empresaId.razaoSocial}>
                              {paciente.empresaId.razaoSocial}
                            </span>
                          )}
                        </div>
                        <div className="paciente-acompanham">
                          <span className={acompanham.length > 0 ? 'paciente-acompanham__nomes' : 'pessoa__sub'}>
                            {acompanham.length > 0
                              ? tr('Acompanhado por: {nomes}', { nomes: acompanham.join(', ') })
                              : tr('Nenhum profissional acompanhando')}
                          </span>
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={tr('Profissionais que acompanham {nome}', { nome: paciente.nome })}
                            title={tr('Profissionais que acompanham')}
                            onClick={() => setPacienteAcompanhamento(paciente)}
                          >
                            <Icone>{ICONES.profissionais}</Icone>
                          </button>
                        </div>
                      </td>
                      {veProntuarios && (
                        <td className="paciente-consultas">
                          <div className="pessoa__dados">
                            {resumo?.emAtendimento ? (
                              <span className="badge badge--live">{tr('Em atendimento')}</span>
                            ) : resumo ? (
                              <span className="nowrap">{formatDataInstanteBR(resumo.ultima)}</span>
                            ) : (
                              <span className="pessoa__sub">{tr('Nunca atendido')}</span>
                            )}
                            {resumo && (
                              <span className="pessoa__sub nowrap">
                                {resumo.total === 1 ? tr('1 atendimento') : tr('{n} atendimentos', { n: resumo.total })}
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                      <td>
                        {confirmandoId === paciente._id ? (
                          <div className="paciente-confirmar">
                            <span>{paciente.teste ? tr('Excluir com tudo?') : tr('Excluir?')}</span>
                            <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar exclusão de {nome}', { nome: paciente.nome })} onClick={() => handleDelete(paciente._id)}>
                              <IconeCheck />
                            </button>
                            <button type="button" className="icon-btn" aria-label={tr('Cancelar exclusão')} onClick={() => setConfirmandoId(null)}>
                              <IconeX />
                            </button>
                          </div>
                        ) : (
                          <div className="table__actions paciente-acoes">
                            {veProntuarios && (
                              <button
                                type="button"
                                className="btn btn--primary btn--sm"
                                aria-label={tr('Abrir prontuário de {nome}', { nome: paciente.nome })}
                                onClick={() => setPacienteEmJanela(paciente)}
                              >
                                <IconeAbrirJanela />
                                {tr('Abrir')}
                              </button>
                            )}
                            <button
                              type="button"
                              className="icon-btn"
                              aria-label={tr('Enviar termo de consentimento para {nome}', { nome: paciente.nome })}
                              title={tr('Termo de consentimento')}
                              onClick={() => navigate('/termos-consentimento', { state: { pacienteId: paciente._id } })}
                            >
                              <IconeFicha />
                            </button>
                            <button type="button" className="icon-btn" aria-label={tr('Editar {nome}', { nome: paciente.nome })} title={tr('Editar')} onClick={() => handleEdit(paciente)}>
                              <IconeLapis />
                            </button>
                            <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Excluir {nome}', { nome: paciente.nome })} title={tr('Excluir')} onClick={() => setConfirmandoId(paciente._id)}>
                              <IconeLixeira />
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
        </div>
      </section>

      {pacienteEditando && (
        <EditarPacienteModal
          key={pacienteEditando._id}
          paciente={pacienteEditando}
          convenios={convenios}
          empresas={empresas}
          erro={error}
          onSave={editPaciente}
          onClose={() => setPacienteEditando(null)}
        />
      )}

      {pacienteAcompanhamento && (
        <AcompanhamentosModal
          key={pacienteAcompanhamento._id}
          paciente={pacienteAcompanhamento}
          profissionais={profissionais}
          erro={error}
          onIncluir={incluirAcompanhamento}
          onEncerrar={finalizarAcompanhamento}
          onClose={() => setPacienteAcompanhamento(null)}
        />
      )}

      {criandoPaciente && (
        <NovoPacienteModal
          convenios={convenios}
          empresas={empresas}
          erro={error}
          onSave={addPaciente}
          onClose={() => setCriandoPaciente(false)}
        />
      )}

      {pacienteEmJanela && <ProntuarioModal paciente={pacienteEmJanela} onClose={fecharProntuario} />}
    </div>
  );
}
