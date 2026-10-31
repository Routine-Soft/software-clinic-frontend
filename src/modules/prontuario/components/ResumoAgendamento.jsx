import { useState } from 'react';
import { formatDataBR } from '@/utils/date';
import { formatarPreco, textoComissaoCalculada } from '@/modules/servico/servico.utils';
import { etiquetasDePagamento, pagaOPlano, situacaoDoLembrete } from '@/modules/agenda/agenda.utils';
import EtiquetaPagamento from '@/modules/agenda/components/EtiquetaPagamento';
import { IconeCheck, IconeImpressora, IconeLapis } from '@/components/CrudCard/icones';
import '../prontuario.css';
import { tr } from '@/i18n';

const STATUS_AGENDA = {
  aguardando: [tr('Aguardando'), 'badge--info'],
  realizado: [tr('Atendido'), 'badge--success'],
  faltou: [tr('Não veio'), 'badge--danger'],
  cancelado: [tr('Cancelado'), 'badge--danger'],
};

// Datas de agendamento são "dia puro" (meia-noite UTC); comparamos só o AAAA-MM-DD com o hoje de Brasília.
function jaChegouODia(data) {
  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  return String(data).slice(0, 10) <= hoje;
}

export default function ResumoAgendamento({ agendamento, erro, onEditar, onCancelar, onImprimir, onMarcarRealizado, onMarcarFalta, onMarcarPagamento }) {
  const [rotulo, classe] = STATUS_AGENDA[agendamento.status] ?? [agendamento.status, ''];
  const cancelado = agendamento.status === 'cancelado';
  const realizado = agendamento.status === 'realizado';
  const faltou = agendamento.status === 'faltou';
  const comissaoPaga = !!agendamento.comissao?.pagamentoId;
  const lembrete = situacaoDoLembrete(agendamento);
  const [salvando, setSalvando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  async function marcar(acao, valor) {
    setSalvando(true);
    setFalhou(false);
    const atualizado = await acao(agendamento, valor);
    setSalvando(false);
    if (!atualizado) setFalhou(true);
  }

  const podeMarcar = onMarcarRealizado && agendamento.status === 'aguardando' && jaChegouODia(agendamento.data);
  const podeDesmarcar = onMarcarRealizado && realizado && !comissaoPaga;
  const podeDesfazerFalta = onMarcarFalta && faltou;
  const cobranca = agendamento.cobrancaId?.parcelas ? agendamento.cobrancaId : null;
  const temEtiquetaPagamento = etiquetasDePagamento(agendamento).length > 0;
  const coparticipacao = agendamento.financeiro?.coparticipacao ?? 0;
  const peloPlano = pagaOPlano(agendamento.convenioId);
  const podePagarAgendamento = onMarcarPagamento && !cobranca && (peloPlano ? coparticipacao > 0 : Number(agendamento.financeiro?.valor) > 0);

  return (
    <section className="pront-agenda" aria-label={tr('Agendamento')}>
      <div className="pront-agenda__cab">
        <div>
          <span className="pront-agenda__rotulo">{tr('Agendamento')}</span>
          <strong className="pront-agenda__horario">
            {formatDataBR(agendamento.data)} · {agendamento.horaInicio} – {agendamento.horaFim}
          </strong>
        </div>
        <span className={`badge ${classe}`}>{rotulo}</span>
      </div>

      <dl className="pront-agenda__dados">
        <div><dt>{tr('Profissional')}</dt><dd>{agendamento.profissionalId?.nome ?? '—'}</dd></div>
        <div><dt>{tr('Serviço')}</dt><dd>{agendamento.servicoId?.nome ?? '—'}</dd></div>
        <div><dt>{tr('Sala')}</dt><dd>{agendamento.salaId?.nome ?? '—'}</dd></div>
        <div><dt>{tr('Convênio')}</dt><dd>{agendamento.convenioId?.nome ?? tr('Particular')}</dd></div>
        {lembrete && (
          <div>
            <dt>{tr('Lembrete WhatsApp')}</dt>
            <dd>
              <span className={`badge badge--${lembrete.tom}`}>{lembrete.rotulo}</span>
              {lembrete.detalhe && <span className="pront-agenda__detalhe">{lembrete.detalhe}</span>}
            </dd>
          </div>
        )}
        {agendamento.status === 'aguardando' && agendamento.finalizadoEm && (
          <div>
            <dt>{tr('Atendimento')}</dt>
            <dd><span className="badge badge--warning">{tr('Profissional finalizou. Falta confirmar.')}</span></dd>
          </div>
        )}
        {peloPlano && coparticipacao > 0 && (
          <div><dt>{tr('Coparticipação')}</dt><dd>{formatarPreco(coparticipacao)}</dd></div>
        )}
        {temEtiquetaPagamento && (
          <div>
            <dt>{tr('Pagamento')}</dt>
            <dd><EtiquetaPagamento agenda={agendamento} sempre /></dd>
          </div>
        )}
        {realizado && agendamento.comissao?.valor > 0 && (
          <div>
            <dt>{tr('Repasse ao profissional')}</dt>
            <dd>{textoComissaoCalculada(agendamento.comissao.valor, agendamento.comissao.percentual)} · {comissaoPaga ? 'paga' : 'pendente'}</dd>
          </div>
        )}
      </dl>

      {cobranca && (
        <ul className="pront-agenda__parcelas pront-no-print">
          <li className="pront-agenda__parcelas-titulo">
            {cobranca.modo === 'avista' ? tr('Pagamento à vista: vale para todas as sessões') : tr('Parcelas')}
          </li>
          {cobranca.parcelas.map((parcela) => (
            <li key={parcela.numero} className="pront-agenda__parcela">
              <span>
                {cobranca.modo === 'parcelado' && `${parcela.numero}/${cobranca.parcelas.length} · `}
                {formatarPreco(parcela.valor)} · {tr('vence em {data}', { data: formatDataBR(parcela.vencimento) })}
              </span>
              {parcela.pagoEm && <span className="agenda-pag agenda-pag--pago">{tr('Pago')}</span>}
              {onMarcarPagamento && (
                <button type="button" className={`btn btn--sm ${parcela.pagoEm ? 'btn--ghost' : 'btn--primary'}`} disabled={salvando} onClick={() => marcar((agenda, pago) => onMarcarPagamento(agenda, pago, parcela.numero), !parcela.pagoEm)}>
                  {parcela.pagoEm ? tr('Desfazer pagamento') : tr('Marcar como pago')}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {falhou && erro && <p className="alert alert--error pront-no-print" role="alert">{erro.message}</p>}

      {(onEditar || onCancelar || onImprimir || podeMarcar || podeDesmarcar || podeDesfazerFalta || podePagarAgendamento) && (
        <div className="pront-agenda__acoes pront-no-print">
          {podeMarcar && (
            <button type="button" className="btn btn--primary btn--sm" disabled={salvando} onClick={() => marcar(onMarcarRealizado, true)}>
              <IconeCheck />
              {salvando ? tr('Salvando...') : tr('Atendido')}
            </button>
          )}
          {podeMarcar && onMarcarFalta && (
            <button type="button" className="btn btn--danger btn--sm" disabled={salvando} onClick={() => marcar(onMarcarFalta, true)}>
              {tr('Não veio')}
            </button>
          )}
          {podeDesmarcar && (
            <button type="button" className="btn btn--ghost btn--sm" disabled={salvando} onClick={() => marcar(onMarcarRealizado, false)}>
              {salvando ? tr('Salvando...') : tr('Desfazer confirmação')}
            </button>
          )}
          {podeDesfazerFalta && (
            <button type="button" className="btn btn--ghost btn--sm" disabled={salvando} onClick={() => marcar(onMarcarFalta, false)}>
              {salvando ? tr('Salvando...') : tr('Desfazer falta')}
            </button>
          )}
          {podePagarAgendamento && (
            <button type="button" className={`btn btn--sm ${agendamento.financeiro?.pagoEm ? 'btn--ghost' : 'btn--primary'}`} disabled={salvando} onClick={() => marcar(onMarcarPagamento, !agendamento.financeiro?.pagoEm)}>
              {salvando ? tr('Salvando...') : agendamento.financeiro?.pagoEm ? tr('Desfazer pagamento') : tr('Marcar como pago')}
            </button>
          )}
          {onEditar && !cancelado && !faltou && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEditar(agendamento)}>
              <IconeLapis />
              {tr('Editar agendamento')}
            </button>
          )}
          {onImprimir && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onImprimir(agendamento)}>
              <IconeImpressora />
              {tr('Comprovante')}
            </button>
          )}
          {onCancelar && !cancelado && !faltou && !comissaoPaga && (
            <button type="button" className="btn btn--danger btn--sm" onClick={() => onCancelar(agendamento)}>
              {tr('Cancelar agendamento')}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
