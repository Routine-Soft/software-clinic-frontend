import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPacienteById } from '@/modules/paciente/paciente.api';
import { IconeSetaEsquerda } from '@/components/CrudCard/icones';
import ProntuarioPaciente from './ProntuarioPaciente';
import SemAcessoProntuario from './SemAcessoProntuario';
import { useAcessoProntuario } from '../prontuario.hooks';

// Prontuário em tela cheia (rota /prontuario/:pacienteId), mesma ficha do modal.
export default function ProntuarioPacientePage() {
  const { pacienteId } = useParams();
  const acesso = useAcessoProntuario();
  const [estado, setEstado] = useState({ pacienteId: null, paciente: null, erro: null });

  useEffect(() => {
    let ignore = false;

    getPacienteById(pacienteId)
      .then((response) => { if (!ignore) setEstado({ pacienteId, paciente: response.data, erro: null }); })
      .catch((err) => { if (!ignore) setEstado({ pacienteId, paciente: null, erro: err }); });

    return () => { ignore = true; };
  }, [pacienteId]);

  const carregando = estado.pacienteId !== pacienteId || acesso.carregando;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <Link to="/prontuario" className="link pront-voltar">
            <IconeSetaEsquerda />
            Todos os prontuários
          </Link>
          <h2 className="page-title">Prontuário</h2>
        </div>
      </header>

      {carregando ? (
        <section className="card pront-pagina" aria-busy="true">
          <div className="skeleton skeleton--bloco" />
        </section>
      ) : !acesso.profissional ? (
        <SemAcessoProntuario />
      ) : estado.erro ? (
        <p className="alert alert--error" role="alert">{estado.erro.message || 'Paciente não encontrado.'}</p>
      ) : (
        <section className="card pront-pagina">
          <ProntuarioPaciente key={estado.paciente._id} paciente={estado.paciente} profissional={acesso.profissional} />
        </section>
      )}
    </div>
  );
}
