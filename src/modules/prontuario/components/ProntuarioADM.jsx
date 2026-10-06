import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePacientes } from '@/modules/paciente/paciente.hooks';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { useEmpresas } from '@/modules/empresa/empresa.hooks';
import NovoPacienteModal from '@/modules/paciente/components/NovoPacienteModal';
import { filtrarPacientes, ordenarPacientes } from '@/modules/paciente/paciente.utils';
import { formatDataBR, calcularIdade } from '@/utils/date';
import { iniciais } from '@/utils/nome';
import { IconeBusca, IconeMais, IconeFicha, IconeAbrirJanela } from '@/components/CrudCard/icones';
import { useTodosProntuarios, useAcessoProntuario } from '../prontuario.hooks';
import { atendimentoEmAndamento, idDoPaciente, formatDataInstanteBR } from '../prontuario.utils';
import ProntuarioModal from './ProntuarioModal';
import SemAcessoProntuario from './SemAcessoProntuario';
import '@/modules/paciente/components/paciente.css';
import '../prontuario.css';

const COLUNAS = 5;

// A lista só carrega para quem pode abrir prontuários; os demais veem a explicação do sigilo.
export default function ProntuarioADM() {
  const acesso = useAcessoProntuario();

  if (acesso.profissional) return <ListaDeProntuarios />;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Prontuário</h2>
        </div>
      </header>
      {acesso.carregando ? <div className="skeleton skeleton--bloco" /> : <SemAcessoProntuario />}
    </div>
  );
}

function ListaDeProntuarios() {
  const navigate = useNavigate();
  const { pacientes, loading, error, addPaciente, refreshPacientes } = usePacientes();
  const { convenios } = useConvenios();
  const { empresas } = useEmpresas();
  const { prontuarios, loading: carregandoProntuarios, refresh: refreshProntuarios } = useTodosProntuarios();

  const [busca, setBusca] = useState('');
  const [criandoPaciente, setCriandoPaciente] = useState(false);
  const [pacienteEmJanela, setPacienteEmJanela] = useState(null);

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

  const pacientesFiltrados = useMemo(
    () => filtrarPacientes(ordenarPacientes(pacientes), busca),
    [pacientes, busca]
  );

  const emAtendimento = useMemo(
    () => [...resumoPorPaciente.values()].filter((r) => r.emAtendimento).length,
    [resumoPorPaciente]
  );

  async function handleCriarPaciente(dados) {
    const criado = await addPaciente(dados);
    if (criado) navigate(`/prontuario/${criado._id}`);
    return criado;
  }

  function fecharJanela() {
    setPacienteEmJanela(null);
    refreshProntuarios();
    refreshPacientes();
  }

  const carregando = loading || carregandoProntuarios;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Prontuário</h2>
          <p className="page-subtitle">Escolha um paciente para abrir a ficha, registrar atendimentos e consultar o histórico</p>
        </div>
        <div className="page-header__acoes">
          {!carregando && emAtendimento > 0 && (
            <span className="badge badge--live">{emAtendimento} em atendimento</span>
          )}
          <button type="button" className="btn btn--primary" onClick={() => setCriandoPaciente(true)}>
            <IconeMais />
            Novo paciente
          </button>
        </div>
      </header>

      {error && !criandoPaciente && (
        <div className="alerts">
          <p className="alert alert--error" role="alert">{error.message}</p>
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
              placeholder="Buscar por nome, CPF, telefone ou e-mail"
              aria-label="Buscar paciente"
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
                <th>Paciente</th>
                <th>Última consulta</th>
                <th>Atendimentos</th>
                <th>Convênio</th>
                <th>Prontuário</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                [0, 1, 2, 3].map((i) => (
                  <tr key={i} style={{ '--i': i }}>
                    {[70, 40, 25, 45, 40].map((largura, coluna) => (
                      <td key={coluna}>
                        <div className="skeleton skeleton--line" style={{ width: `${largura}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pacientesFiltrados.length === 0 ? (
                <tr>
                  <td className="table__empty" colSpan={COLUNAS}>
                    {pacientes.length === 0 ? 'Nenhum paciente cadastrado ainda.' : 'Nenhum paciente encontrado para essa busca.'}
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((paciente, index) => {
                  const resumo = resumoPorPaciente.get(paciente._id);
                  const idade = calcularIdade(paciente.dataNascimento);
                  return (
                    <tr key={paciente._id} style={{ '--i': Math.min(index, 12) }}>
                      <td>
                        <div className="pessoa">
                          <div className="pessoa__avatar" aria-hidden="true">{iniciais(paciente.nome)}</div>
                          <div className="pessoa__dados">
                            <Link to={`/prontuario/${paciente._id}`} className="pessoa__nome pront-link-nome">{paciente.nome}</Link>
                            <span className="pessoa__sub nowrap">
                              {formatDataBR(paciente.dataNascimento) ?? '—'}
                              {idade !== null && ` · ${idade} ${idade === 1 ? 'ano' : 'anos'}`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="nowrap">
                        {resumo?.emAtendimento ? (
                          <span className="badge badge--live">Em atendimento</span>
                        ) : resumo ? (
                          formatDataInstanteBR(resumo.ultima)
                        ) : (
                          <span className="pessoa__sub">Nunca atendido</span>
                        )}
                      </td>
                      <td className="nowrap">{resumo?.total ?? 0}</td>
                      <td>
                        {paciente.convenioId?.nome
                          ? <span className="badge badge--info">{paciente.convenioId.nome}</span>
                          : <span className="badge">Sem convênio</span>}
                      </td>
                      <td>
                        <div className="table__actions">
                          <Link to={`/prontuario/${paciente._id}`} className="btn btn--primary btn--sm">
                            <IconeFicha />
                            Abrir
                          </Link>
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`Abrir prontuário de ${paciente.nome} em janela`}
                            title="Abrir em janela"
                            onClick={() => setPacienteEmJanela(paciente)}
                          >
                            <IconeAbrirJanela />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {criandoPaciente && (
        <NovoPacienteModal
          convenios={convenios}
          empresas={empresas}
          erro={error}
          onSave={handleCriarPaciente}
          onClose={() => setCriandoPaciente(false)}
        />
      )}

      {pacienteEmJanela && <ProntuarioModal paciente={pacienteEmJanela} onClose={fecharJanela} />}
    </div>
  );
}
