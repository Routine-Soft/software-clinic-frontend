import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';

// Mostrado a quem não pode abrir prontuários: recepção, super admin e logins sem cadastro de profissional.
export default function SemAcessoProntuario() {
  return (
    <section className="card pront-sem-acesso" role="note">
      <Icone>{ICONES.prontuario}</Icone>
      <p>
        O prontuário é sigiloso: só profissionais de saúde que atendem o paciente podem abri-lo. Para ter acesso, seu
        login precisa estar vinculado a um cadastro de profissional (em Profissionais, opção "vincular a um usuário").
      </p>
    </section>
  );
}
