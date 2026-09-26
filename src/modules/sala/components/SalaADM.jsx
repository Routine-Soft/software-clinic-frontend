import { useSalas } from '../sala.hooks';
import CrudCard from '@/components/CrudCard/CrudCard';

const IconeSala = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 4h3a2 2 0 0 1 2 2v14" />
    <path d="M2 20h3M13 20h9M10 12v.01" />
    <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
  </svg>
);

export default function SalaADM({ className }) {
  const { salas, loading, error, successMessage, addSala, editSala, removeSala } = useSalas();

  return (
    <CrudCard
      className={className}
      titulo="Salas"
      subtitulo="Ambientes de atendimento da clínica"
      icone={<IconeSala />}
      singular="sala"
      plural="salas"
      labelNovo="Nova sala"
      placeholder="Ex: Sala 1, Consultório A"
      textoVazio="Nenhuma sala cadastrada ainda."
      tituloEdicao="Editar sala"
      itens={salas}
      loading={loading}
      error={error}
      successMessage={successMessage}
      onAdd={addSala}
      onEdit={editSala}
      onRemove={removeSala}
    />
  );
}
