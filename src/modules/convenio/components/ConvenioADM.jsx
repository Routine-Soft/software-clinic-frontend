import { useConvenios } from '../convenio.hooks';
import CrudCard from '@/components/CrudCard/CrudCard';
import { pagaOPlano } from '@/modules/agenda/agenda.utils';
import { formatarPreco } from '@/modules/servico/servico.utils';
import ConvenioModal from './ConvenioModal';
import { tr } from '@/i18n';

const IconeConvenio = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

function quemPaga(convenio) {
  if (!pagaOPlano(convenio)) return tr('O paciente paga');
  if (convenio.coparticipacao > 0) return tr('Plano paga · coparticipação de {valor}', { valor: formatarPreco(convenio.coparticipacao) });
  return tr('Plano paga · sem coparticipação');
}

export default function ConvenioADM({ className }) {
  const { convenios, loading, error, successMessage, addConvenio, editConvenio, removeConvenio } = useConvenios();

  return (
    <CrudCard
      className={className}
      titulo={tr('Convênios')}
      subtitulo={tr('Particular e planos de saúde aceitos pela clínica')}
      icone={<IconeConvenio />}
      singular={tr('convênio')}
      plural={tr('convênios')}
      labelNovo={tr('Novo convênio')}
      placeholder={tr('Ex.: Particular, Unimed, Bradesco Saúde')}
      dica={tr('Cadastre cada forma de atendimento da clínica, inclusive o Particular. Só o que estiver aqui aparece no agendamento.')}
      textoVazio={tr('Nenhum convênio cadastrado ainda. Comece pelo Particular.')}
      tituloEdicao={tr('Editar convênio')}
      itens={convenios}
      loading={loading}
      error={error}
      successMessage={successMessage}
      onAdd={addConvenio}
      onEdit={editConvenio}
      onRemove={removeConvenio}
      ModalItem={ConvenioModal}
      detalhe={quemPaga}
    />
  );
}
