import { useState } from 'react';
import { formatDataBR } from '@/utils/date';
import { textoComissaoCalculada } from '@/modules/servico/servico.utils';
import { IconeCheck, IconeImpressora, IconeLapis } from '@/components/CrudCard/icones';
import '../prontuario.css';

const STATUS_AGENDA = {
  aguardando: ['Aguardando', 'badge--info'],
  realizado: ['Realizado', 'badge--success'],
  cancelado: ['Cancelado', 'badge--danger'],
};

// Datas de agendamento são "dia puro" (meia-noite UTC); comparamos só o AAAA-MM-DD com o hoje de Brasília.
function jaChegouODia(data) {
  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  return String(data).slice(0, 10) <= hoje;
}

export default function ResumoAgendamento({ agendamento, erro, onEditar, onCancelar, onImprimir, onMarcarRealizado }) {
  const [rotulo, classe] = STATUS_AGENDA[agendamento.status] ?? [agendamento.status, ''];
  const cancelado = agendamento.status === 'cancelado';
  const realizado = agendamento.status === 'realizado';
  const comissaoPaga = !!agendamento.comissao?.pagamentoId;
  const [salvando, setSalvando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  async function alternarRealizado(valor) {
    setSalvando(true);
    setFalhou(false);
    const atualizado = await onMarcarRealizado(agendamento, valor);
    setSalvando(false);
    if (!atualizado) setFalhou(true);
  }

  const podeMarcar = onMarcarRealizado && agendamento.status === 'aguardando' && jaChegouODia(agendamento.data);
  const podeDesmarcar = onMarcarRealizado && realizado && !comissaoPaga;

  return (
    <section className="pront-agenda" aria-label="Agendamento">
      <div className="pront-agenda__cab">
        <div>
          <span className="pront-agenda__rotulo">Agendamento</span>
          <strong className="pront-agenda__horario">
            {formatDataBR(agendamento.data)} · {agendamento.horaInicio} – {agendamento.horaFim}
          </strong>
        </div>
        <span className={`badge ${classe}`}>{rotulo}</span>
      </div>

      <dl className="pront-agenda__dados">
        <div><dt>Profissional</dt><dd>{agendamento.profissionalId?.nome ?? '—'}</dd></div>
        <div><dt>Serviço</dt><dd>{agendamento.servicoId?.nome ?? '—'}</dd></div>
        <div><dt>Sala</dt><dd>{agendamento.salaId?.nome ?? '—'}</dd></div>
        <div><dt>Convênio</dt><dd>{agendamento.convenioId?.nome ?? 'Particular'}</dd></div>
        {realizado && agendamento.comissao?.valor > 0 && (
          <div>
            <dt>Repasse ao profissional</dt>
            <dd>{textoComissaoCalculada(agendamento.comissao.valor, agendamento.comissao.percentual)} · {comissaoPaga ? 'paga' : 'pendente'}</dd>
          </div>
        )}
      </dl>

      {falhou && erro && <p className="alert alert--error pront-no-print" role="alert">{erro.message}</p>}

      {(onEditar || onCancelar || onImprimir || podeMarcar || podeDesmarcar) && (
        <div className="pront-agenda__acoes pront-no-print">
          {podeMarcar && (
            <button type="button" className="btn btn--primary btn--sm" disabled={salvando} onClick={() => alternarRealizado(true)}>
              <IconeCheck />
              {salvando ? 'Salvando...' : 'Marcar como realizado'}
            </button>
          )}
          {podeDesmarcar && (
            <button type="button" className="btn btn--ghost btn--sm" disabled={salvando} onClick={() => alternarRealizado(false)}>
              {salvando ? 'Salvando...' : 'Desmarcar realizado'}
            </button>
          )}
          {onEditar && !cancelado && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEditar(agendamento)}>
              <IconeLapis />
              Editar agendamento
            </button>
          )}
          {onImprimir && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onImprimir(agendamento)}>
              <IconeImpressora />
              Comprovante
            </button>
          )}
          {onCancelar && !cancelado && !comissaoPaga && (
            <button type="button" className="btn btn--danger btn--sm" onClick={() => onCancelar(agendamento)}>
              Cancelar agendamento
            </button>
          )}
        </div>
      )}
    </section>
  );
}
