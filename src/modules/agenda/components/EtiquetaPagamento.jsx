import { agendaAtiva, etiquetasDePagamento } from '../agenda.utils';

// Situação do pagamento em texto pequeno, nos cards. `sempre` mostra também em cancelado e falta.
export default function EtiquetaPagamento({ agenda, sempre = false }) {
  if (!sempre && !agendaAtiva(agenda)) return null;
  return etiquetasDePagamento(agenda).map(({ situacao, rotulo }) => (
    <span key={situacao} className={`agenda-pag agenda-pag--${situacao}`}>{rotulo}</span>
  ));
}
