import { useEffect, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { formatarData, formatarPreco } from '@/modules/assinatura/assinatura.utils';
import { getHistoricoPagamentosAdmin } from '../clinica-admin.api';
import { tempoDeCasa, ROTULO_METODO_PAGAMENTO } from '../clinica-admin.utils';
import { tr } from '@/i18n';

function Numero({ rotulo, valor, tom }) {
  return (
    <div className="clinica-numero" data-tom={tom}>
      <strong>{valor}</strong>
      <span>{rotulo}</span>
    </div>
  );
}

// Uso da clínica e tudo o que ela já pagou, com o histórico de pagamentos (data, valor e forma).
export default function DetalhesClinicaModal({ admin, onClose }) {
  const [pagamentos, setPagamentos] = useState(null);
  const [erro, setErro] = useState(null);
  const e = admin.estatisticas ?? {};
  const tempo = tempoDeCasa(admin.createdAt);

  useEffect(() => {
    let ignore = false;
    getHistoricoPagamentosAdmin(admin._id)
      .then((response) => { if (!ignore) setPagamentos(response.data); })
      .catch((err) => { if (!ignore) setErro(err); });
    return () => { ignore = true; };
  }, [admin._id]);

  return (
    <Modal title={admin.nomeEmpresa} wide onClose={onClose}>
      {() => (
        <div className="clinica-detalhes">
          <p className="clinica-detalhes__sub">
            {tr('{nomeCompleto} · cliente {p0} (desde {p1})', { nomeCompleto: admin.nomeCompleto, p0: tempo === 'hoje' ? tr('desde hoje') : tr('há {tempo}', { tempo }), p1: formatarData(admin.createdAt) })}
          </p>

          <section aria-label={tr('Cadastros')}>
            <h4 className="clinica-detalhes__titulo">{tr('Cadastros')}</h4>
            <div className="clinica-numeros">
              <Numero rotulo={e.usuarios === 1 ? tr('Usuário') : tr('Usuários')} valor={e.usuarios ?? 0} />
              <Numero rotulo={e.profissionais === 1 ? tr('Profissional') : tr('Profissionais')} valor={e.profissionais ?? 0} />
              <Numero rotulo={e.pacientes === 1 ? tr('Paciente') : tr('Pacientes')} valor={e.pacientes ?? 0} />
              <Numero rotulo={e.empresas === 1 ? tr('Empresa') : tr('Empresas')} valor={e.empresas ?? 0} />
            </div>
          </section>

          <section aria-label={tr('Agendamentos')}>
            <h4 className="clinica-detalhes__titulo">{tr('Agendamentos')}</h4>
            <div className="clinica-numeros">
              <Numero rotulo={tr('Em aberto')} valor={e.agendamentos?.abertos ?? 0} tom="info" />
              <Numero rotulo={e.agendamentos?.realizados === 1 ? tr('Realizado') : tr('Realizados')} valor={e.agendamentos?.realizados ?? 0} tom="success" />
              <Numero rotulo={e.agendamentos?.cancelados === 1 ? tr('Cancelado') : tr('Cancelados')} valor={e.agendamentos?.cancelados ?? 0} tom="danger" />
            </div>
          </section>

          <section aria-label={tr('Pagamentos')}>
            <h4 className="clinica-detalhes__titulo">{tr('Pagamentos')}</h4>
            <div className="clinica-numeros">
              <Numero rotulo={tr('Total pago')} valor={formatarPreco(e.totalPago ?? 0, e.moedaPaga)} tom="success" />
              <Numero rotulo={e.pagamentos === 1 ? tr('Pagamento') : tr('Pagamentos')} valor={e.pagamentos ?? 0} />
            </div>

            {erro ? (
              <p className="alert alert--error" role="alert">{erro.message}</p>
            ) : pagamentos === null ? (
              <div className="skeleton skeleton--line" style={{ width: '60%' }} aria-busy="true" />
            ) : pagamentos.length === 0 ? (
              <p className="clinica-detalhes__vazio">{tr('Nenhum pagamento recebido ainda.')}</p>
            ) : (
              <div className="table-wrap">
                <table className="table clinica-pagamentos">
                  <thead>
                    <tr>
                      <th>{tr('Data')}</th>
                      <th>{tr('Valor')}</th>
                      <th>{tr('Forma')}</th>
                      <th>{tr('Plano')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagamentos.map((p) => (
                      <tr key={p._id}>
                        <td className="nowrap">{formatarData(p.aprovadoEm)}</td>
                        <td className="nowrap">{formatarPreco(p.valor, p.moeda)}</td>
                        <td>{ROTULO_METODO_PAGAMENTO[p.metodo] ?? p.metodo}</td>
                        <td>{p.plano ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </Modal>
  );
}
