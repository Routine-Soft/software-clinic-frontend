import { useMemo, useState } from 'react';
import { usePacientes } from '../paciente.hooks';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { useEmpresas } from '@/modules/empresa/empresa.hooks';
import { filtrarPacientes, ordenarPacientes } from '../paciente.utils';
import { iniciais } from '@/utils/nome';
import { Icone, IconeMais, IconeBusca, IconeLapis, IconeLixeira, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import EditarPacienteModal from './EditarPacienteModal';
import NovoPacienteModal from './NovoPacienteModal';
import '@/components/CrudCard/CrudCard.css';

const IconePacientes = () => (
  <Icone>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Icone>
);

export default function PacienteCard({ className = '' }) {
  const { pacientes, loading, error, successMessage, addPaciente, editPaciente, removePaciente } = usePacientes();
  const { convenios } = useConvenios();
  const { empresas } = useEmpresas();

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

  const algumModalAberto = criandoPaciente || !!pacienteEditando;

  return (
    <section className={`card crud-card ${className}`.trim()}>
      <header className="crud-card__head">
        <div className="crud-card__icon"><IconePacientes /></div>

        <div className="crud-card__titulos">
          <h3 className="crud-card__titulo">Pacientes</h3>
          <p className="crud-card__subtitulo">Busque, cadastre e edite pacientes</p>
        </div>

        {!loading && (
          <span className="badge badge--primary">
            {pacientes.length} {pacientes.length === 1 ? 'paciente' : 'pacientes'}
          </span>
        )}
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts crud-card__alertas">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <div className="crud-card__barra">
        <div className="search">
          <IconeBusca />
          <input
            className="input"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome, CPF, telefone ou e-mail"
            aria-label="Buscar paciente"
          />
        </div>

        <button type="button" className="btn btn--primary" onClick={() => setCriandoPaciente(true)}>
          <IconeMais />
          Novo
        </button>
      </div>

      {loading ? (
        <ul className="crud-lista" aria-busy="true" aria-label="Carregando pacientes">
          {[0, 1, 2].map((i) => (
            <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
              <div className="skeleton crud-item__icone-skeleton" />
              <div className="skeleton skeleton--line" style={{ width: `${60 - i * 10}%` }} />
            </li>
          ))}
        </ul>
      ) : pacientesFiltrados.length === 0 ? (
        <div className="crud-vazio">
          <IconePacientes />
          <p>{pacientes.length === 0 ? 'Nenhum paciente cadastrado ainda.' : 'Nenhum paciente encontrado para essa busca.'}</p>
        </div>
      ) : (
        <ul className="crud-lista">
          {pacientesFiltrados.map((paciente, index) => (
            <li
              key={paciente._id}
              className={`crud-item${pacienteEditando?._id === paciente._id ? ' crud-item--editando' : ''}`}
              style={{ '--i': Math.min(index, 12) }}
            >
              <div className="crud-item__icone crud-item__icone--iniciais" aria-hidden="true">{iniciais(paciente.nome)}</div>

              <div className="crud-item__info">
                <span className="crud-item__nome" title={paciente.nome}>{paciente.nome}</span>
                <span className="crud-item__meta">
                  <span>{paciente.telefone}</span>
                  {paciente.convenioId?.nome
                    ? <span className="badge badge--info">{paciente.convenioId.nome}</span>
                    : <span className="badge">Particular</span>}
                  {paciente.empresaId?.razaoSocial && <span className="badge badge--primary">{paciente.empresaId.razaoSocial}</span>}
                </span>
                <span className="crud-item__sub" title={paciente.email}>{paciente.email}</span>
              </div>

              {confirmandoId === paciente._id ? (
                <div className="crud-item__confirmar">
                  <span>Excluir?</span>
                  <button type="button" className="icon-btn icon-btn--danger" aria-label={`Confirmar exclusão de ${paciente.nome}`} onClick={() => handleDelete(paciente._id)}>
                    <IconeCheck />
                  </button>
                  <button type="button" className="icon-btn" aria-label="Cancelar exclusão" onClick={() => setConfirmandoId(null)}>
                    <IconeX />
                  </button>
                </div>
              ) : (
                <div className="crud-item__acoes">
                  <button type="button" className="icon-btn" aria-label={`Editar ${paciente.nome}`} title="Editar" onClick={() => handleEdit(paciente)}>
                    <IconeLapis />
                  </button>
                  <button type="button" className="icon-btn icon-btn--danger" aria-label={`Excluir ${paciente.nome}`} title="Excluir" onClick={() => setConfirmandoId(paciente._id)}>
                    <IconeLixeira />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

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

      {criandoPaciente && (
        <NovoPacienteModal
          convenios={convenios}
          empresas={empresas}
          erro={error}
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoPaciente(false)}
        />
      )}
    </section>
  );
}
