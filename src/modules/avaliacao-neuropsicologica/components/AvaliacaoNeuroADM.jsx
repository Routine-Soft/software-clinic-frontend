import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePacientes } from '@/modules/paciente/paciente.hooks';
import { useServicos } from '@/modules/servico/servico.hooks';
import { useAcessoProntuario } from '@/modules/prontuario/prontuario.hooks';
import SemAcessoProntuario from '@/modules/prontuario/components/SemAcessoProntuario';
import { IconeMais, IconeBusca, IconeFicha } from '@/components/CrudCard/icones';
import { formatDataInstanteBR } from '@/modules/prontuario/prontuario.utils';
import { useAvaliacoesNeuro } from '../avaliacao-neuro.hooks';
import { createAvaliacaoNeuro } from '../avaliacao-neuro.api';
import { situacaoDa } from '../avaliacao-neuro.utils';
import NovaAvaliacaoNeuroModal from './NovaAvaliacaoNeuroModal';
import '../avaliacao-neuro.css';

const normalizar = (texto = '') => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Documento psicológico: só profissionais com login vinculado abrem (mesmo sigilo do prontuário).
export default function AvaliacaoNeuroADM() {
  const acesso = useAcessoProntuario();

  if (acesso.profissional) return <ListaDeAvaliacoes />;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Avaliação neuropsicológica</h2>
        </div>
      </header>
      {acesso.carregando ? <div className="skeleton skeleton--bloco" /> : <SemAcessoProntuario />}
    </div>
  );
}

function ListaDeAvaliacoes() {
  const navigate = useNavigate();
  const { avaliacoes, loading, error } = useAvaliacoesNeuro();
  const { pacientes, loading: carregandoPacientes } = usePacientes();
  const { servicos } = useServicos();
  const [busca, setBusca] = useState('');
  const [criando, setCriando] = useState(false);
  const [erroCriar, setErroCriar] = useState(null);

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return avaliacoes;
    return avaliacoes.filter((a) => [a.pacienteId?.nome, a.profissionalId?.nome, a.finalidade].some((t) => normalizar(t ?? '').includes(termo)));
  }, [avaliacoes, busca]);

  async function handleCriar(dados) {
    setErroCriar(null);
    try {
      const response = await createAvaliacaoNeuro(dados);
      navigate(`/avaliacoes-neuropsicologicas/${response.data._id}`);
      return true;
    } catch (err) {
      setErroCriar(err);
      return false;
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Avaliação neuropsicológica</h2>
          <p className="page-subtitle">Anamnese, sessões, testes e laudo no formato da Resolução CFP 06/2019</p>
        </div>
        <div className="page-header__acoes">
          <button type="button" className="btn btn--primary" onClick={() => { setErroCriar(null); setCriando(true); }}>
            <IconeMais />
            Nova avaliação
          </button>
        </div>
      </header>

      {error && (
        <div className="alerts">
          <p className="alert alert--error" role="alert">{error.message}</p>
        </div>
      )}

      <section className="card neuro-tabela">
        <div className="neuro-toolbar">
          <div className="search">
            <IconeBusca />
            <input className="input" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por paciente, profissional ou finalidade" aria-label="Buscar avaliação" />
          </div>
        </div>

        <div className="table-wrap">
          <table className="table" aria-busy={loading}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Profissional</th>
                <th>Início</th>
                <th>Sessões</th>
                <th>Situação</th>
                <th>Avaliação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [0, 1, 2].map((i) => (
                  <tr key={i} style={{ '--i': i }}>
                    {[60, 45, 30, 15, 30, 25].map((largura, coluna) => (
                      <td key={coluna}><div className="skeleton skeleton--line" style={{ width: `${largura}%` }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtradas.length === 0 ? (
                <tr>
                  <td className="table__empty" colSpan={6}>
                    {avaliacoes.length === 0 ? 'Nenhuma avaliação ainda. Use "Nova avaliação" para começar.' : 'Nenhuma avaliação encontrada para essa busca.'}
                  </td>
                </tr>
              ) : (
                filtradas.map((avaliacao, index) => {
                  const [situacao, classe] = situacaoDa(avaliacao);
                  return (
                    <tr key={avaliacao._id} style={{ '--i': Math.min(index, 12) }}>
                      <td>
                        <Link to={`/avaliacoes-neuropsicologicas/${avaliacao._id}`} className="neuro-link">{avaliacao.pacienteId?.nome ?? 'Paciente removido'}</Link>
                        {avaliacao.finalidade && <span className="neuro-sub">{avaliacao.finalidade}</span>}
                      </td>
                      <td>{avaliacao.profissionalId?.nome ?? '—'}</td>
                      <td className="nowrap">{formatDataInstanteBR(avaliacao.createdAt)}</td>
                      <td>{avaliacao.sessoes?.length ?? 0}</td>
                      <td><span className={`badge ${classe}`}>{situacao}</span></td>
                      <td>
                        <Link to={`/avaliacoes-neuropsicologicas/${avaliacao._id}`} className="btn btn--primary btn--sm">
                          <IconeFicha />
                          Abrir
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {criando && (
        <NovaAvaliacaoNeuroModal
          pacientes={pacientes}
          servicos={servicos}
          carregando={carregandoPacientes}
          erro={erroCriar}
          onSave={handleCriar}
          onClose={() => setCriando(false)}
        />
      )}
    </div>
  );
}
