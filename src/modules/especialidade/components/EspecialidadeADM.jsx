import { useEspecialidades } from '../especialidade.hooks';
import CrudCard from '@/components/CrudCard/CrudCard';

const IconeEspecialidade = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    <circle cx="12" cy="8" r="6" />
  </svg>
);

export default function EspecialidadeADM({ className }) {
  const { especialidades, loading, error, successMessage, addEspecialidade, editEspecialidade, removeEspecialidade } = useEspecialidades();

  return (
    <CrudCard
      className={className}
      titulo="Especialidades"
      subtitulo="Áreas de atuação dos profissionais da clínica"
      icone={<IconeEspecialidade />}
      singular="especialidade"
      plural="especialidades"
      labelNovo="Nova especialidade"
      placeholder="Ex: Fisioterapia, Dermatologia"
      textoVazio="Nenhuma especialidade cadastrada ainda."
      tituloEdicao="Editar especialidade"
      itens={especialidades}
      loading={loading}
      error={error}
      successMessage={successMessage}
      onAdd={addEspecialidade}
      onEdit={editEspecialidade}
      onRemove={removeEspecialidade}
    />
  );
}
