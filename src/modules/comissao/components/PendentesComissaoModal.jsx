import Modal from '@/components/Modal/Modal';
import { usePendentesComissao } from '../comissao.hooks';
import { formatarPreco, textoComissaoCalculada } from '@/modules/servico/servico.utils';
import { formatDataBR } from '@/utils/date';

// Detalhe do que entra no próximo pagamento, com a divisão entre o profissional e a clínica.
export default function PendentesComissaoModal({ profissional, onClose }) {
  const { pendentes, loading, error } = usePendentesComissao(profissional._id);

  const soma = (campo) => pendentes.reduce((total, item) => total + item[campo], 0);

  return (
    <Modal title={`Repasse pendente · ${profissional.nome}`} wide onClose={onClose}>
      {error && <p className="alert alert--error" role="alert">{error.message}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Paciente</th>
              <th>Serviço</th>
              <th>Atendimento</th>
              <th>Repasse</th>
              <th>Clínica</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="skeleton skeleton--line" style={{ width: '60%' }} /></td></tr>
            ) : pendentes.length === 0 ? (
              <tr><td className="table__empty" colSpan={6}>Nenhum atendimento pendente.</td></tr>
            ) : (
              pendentes.map((item, index) => (
                <tr key={item._id} style={{ '--i': Math.min(index, 12) }}>
                  <td className="nowrap">{formatDataBR(item.data)} · {item.horaInicio}</td>
                  <td>{item.paciente ?? '—'}</td>
                  <td>{item.servico ?? '—'}<span className="comissao-pessoa__sub"> · {item.convenio ?? 'Particular'}</span></td>
                  <td className="table__num">{formatarPreco(item.valorAtendimento)}</td>
                  <td className="table__num">{textoComissaoCalculada(item.comissao, item.comissaoPercentual)}</td>
                  <td className="table__num">{formatarPreco(item.parteClinica)}</td>
                </tr>
              ))
            )}
          </tbody>
          {!loading && pendentes.length > 0 && (
            <tfoot>
              <tr className="comissao-total">
                <td colSpan={3}>Total ({pendentes.length})</td>
                <td className="table__num">{formatarPreco(soma('valorAtendimento'))}</td>
                <td className="table__num">{formatarPreco(soma('comissao'))}</td>
                <td className="table__num">{formatarPreco(soma('parteClinica'))}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Modal>
  );
}
