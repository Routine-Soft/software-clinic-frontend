import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../paciente.hooks';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { useEmpresas } from '@/modules/empresa/empresa.hooks';
import { filtrarPacientes, ordenarPacientes, contatoDoPaciente, rotuloDoResponsavel, cpfDoPaciente, nomesQueAcompanham } from '../paciente.utils';
import { useProfissionais } from '@/modules/profissional/profissional.hooks';
import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import AcompanhamentosModal from './AcompanhamentosModal';
import { formatDataBR, calcularIdade } from '@/utils/date';
import { iniciais } from '@/utils/nome';
import { IconeBusca, IconeLapis, IconeLixeira, IconeCheck, IconeX, IconeFicha } from '@/components/CrudCard/icones';
import EditarPacienteModal from './EditarPacienteModal';
import NovoPacienteModal from './NovoPacienteModal';
import { IconeMais } from '@/components/CrudCard/icones';
import './paciente.css';
import SeloTeste from './SeloTeste';
import { tr } from '@/i18n';

const COLUNAS = 5;

export default function PacienteADM() {
  const { pacientes, loading, error, successMessage, addPaciente, editPaciente, removePaciente, incluirAcompanhamento, finalizarAcompanhamento } = usePacientes();
  const { profissionais } = useProfissionais();
  const [pacienteAcompanhamento, setPacienteAcompanhamento] = useState(null);
  const { convenios } = useConvenios();
  const { empresas } = useEmpresas();
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [criandoPaciente, setCriandoPaciente] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);

  const pacientesFiltrados = useMemo(
    () => filtrarPacientes(ordenarPacientes(pacientes), busca),
    [pacientes, busca]
  );

  async function handleSalvarCriacao(dados) {
    return await addPaciente(dados);
  }

  function handleEdit(paciente) {
    setConfirmandoId(null);
    setPacienteEditando(paciente);
  }

  async function handleSalvarEdicao(id, dados) {
    return await editPaciente(id, dados);
  }

  async function handleDelete(id) {
    setConfirmandoId(null);
    await removePaciente(id);
  }

  const algumModalAberto = criandoPaciente || !!pacienteEditando || !!pacienteAcompanhamento;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Pacientes')}</h2>
          <p className="page-subtitle">{tr('Cadastro e consulta dos pacientes da clínica')}</p>
        </div>
        <div className="page-header__acoes">
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
          <table className="table paciente-table" aria-busy={loading}>
            <thead>
              <tr>
                <th>{tr('Paciente')}</th>
                <th>{tr('Contato')}</th>
                <th>{tr('Nascimento')}</th>
                <th>{tr('Convênio e empresa')}</th>
                <th>{tr('Ações')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [0, 1, 2, 3].map((i) => (
                  <tr key={i} style={{ '--i': i }}>
                    {[70, 55, 40, 50, 30].map((largura, coluna) => (
                      <td key={coluna}>
                        <div className="skeleton skeleton--line" style={{ width: `${largura}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pacientesFiltrados.length === 0 ? (
                <tr>
                  <td className="table__empty" colSpan={COLUNAS}>
                    {pacientes.length === 0 ? tr('Nenhum paciente cadastrado ainda.') : tr('Nenhum paciente encontrado para essa busca.')}
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((paciente, index) => {
                  const idade = calcularIdade(paciente.dataNascimento);
                  const contato = contatoDoPaciente(paciente);
                  const responsaveis = paciente.responsaveis ?? [];
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
                            <strong className="pessoa__nome">{paciente.nome}</strong>
                            <span className="pessoa__sub nowrap">{cpfDoPaciente(paciente)} <SeloTeste paciente={paciente} /></span>
                            {responsaveis.length > 0 && (
                              <span className="pessoa__resp">{tr('Resp.: {p0}', { p0: responsaveis.map(rotuloDoResponsavel).join(', ') })}</span>
                            )}
                            {nomesQueAcompanham(paciente).length > 0 && (
                              <span className="pessoa__acompanha">{tr('Acompanha: {nomes}', { nomes: nomesQueAcompanham(paciente).join(', ') })}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="pessoa__dados pessoa__dados--contato">
                          <span className="nowrap">{contato.telefone || '—'}</span>
                          <span className="pessoa__sub pessoa__sub--corta" title={contato.email}>{contato.email}</span>
                        </div>
                      </td>
                      <td className="nowrap">
                        <div className="pessoa__dados">
                          <span>{formatDataBR(paciente.dataNascimento) ?? '—'}</span>
                          {idade !== null && <span className="pessoa__sub">{idade} {idade === 1 ? tr('ano') : tr('anos')}{idade < 18 ? tr(' · menor') : ''}</span>}
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
                      </td>
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
                          <div className="table__actions">
                            <button
                              type="button"
                              className="icon-btn"
                              aria-label={tr('Profissionais que acompanham {nome}', { nome: paciente.nome })}
                              title={tr('Profissionais que acompanham')}
                              onClick={() => setPacienteAcompanhamento(paciente)}
                            >
                              <Icone>{ICONES.profissionais}</Icone>
                            </button>
                            <button
                              type="button"
                              className="icon-btn"
                              aria-label={tr('Enviar termo de consentimento para {nome}', { nome: paciente.nome })}
                              title={tr('Termo de consentimento')}
                              onClick={() => navigate('/termos-consentimento', { state: { pacienteId: paciente._id } })}
                            >
                              <IconeFicha />
                            </button>
                            <button type="button" className="icon-btn" aria-label={`Editar ${paciente.nome}`} title={tr('Editar')} onClick={() => handleEdit(paciente)}>
                              <IconeLapis />
                            </button>
                            <button type="button" className="icon-btn icon-btn--danger" aria-label={`Excluir ${paciente.nome}`} title={tr('Excluir')} onClick={() => setConfirmandoId(paciente._id)}>
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
          onSave={handleSalvarEdicao}
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
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoPaciente(false)}
        />
      )}
    </div>
  );
}
