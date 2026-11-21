import { useParams } from 'react-router-dom';
import { IconeImpressora } from '@/components/CrudCard/icones';
import { formatDataBR } from '@/utils/date';
import { useProntuarioImpressao } from '../prontuario.hooks';
import { CAMPOS_TEXTO, sinaisVitaisEmLista, formatDuracao, formatDataHoraBR } from '../prontuario.utils';
import '../prontuario.css';
import { tr } from '@/i18n';

// Um atendimento finalizado em página própria (sem o menu), para imprimir e o profissional assinar e
// carimbar no papel, enquanto o sistema não tem assinatura digital ICP-Brasil. Abre em #/prontuarios/:id/imprimir.
export default function ProntuarioImpressao() {
  const { id } = useParams();
  const { prontuario, loading, error } = useProntuarioImpressao(id);

  return (
    <div className="pront-impressao">
      <div className="pront-impressao__barra pront-no-print">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.close()}>{tr('Fechar')}</button>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => window.print()} disabled={!prontuario}>
          <IconeImpressora />
          {tr('Imprimir ou salvar em PDF')}
        </button>
      </div>

      <main className="card pront-impressao__folha">
        {loading ? (
          <div className="skeleton skeleton--bloco" aria-busy="true" />
        ) : error ? (
          <p className="alert alert--error" role="alert">{error.message}</p>
        ) : (
          <FolhaAtendimento prontuario={prontuario} />
        )}
      </main>
    </div>
  );
}

function FolhaAtendimento({ prontuario }) {
  const paciente = prontuario.pacienteId ?? {};
  const profissional = prontuario.profissionalId ?? {};
  const registro = [profissional.tipoRegistro, profissional.numeroRegistro].filter(Boolean).join(' ');
  const sinais = sinaisVitaisEmLista(prontuario.sinaisVitais);
  const preenchidos = CAMPOS_TEXTO.filter(([campo]) => prontuario[campo]);
  const adendos = prontuario.adendos ?? [];

  return (
    <>
      <header className="pront-impressao__cab">
        {prontuario.clinica && <p className="pront-impressao__clinica">{prontuario.clinica}</p>}
        <h1>{tr('Registro de atendimento')}</h1>
        <p>
          {[
            paciente.nome && tr('Paciente: {nome}', { nome: paciente.nome }),
            paciente.dataNascimento && tr('Nascimento: {data}', { data: formatDataBR(paciente.dataNascimento) }),
            paciente.cpf && tr('CPF: {cpf}', { cpf: paciente.cpf }),
          ].filter(Boolean).join('  ·  ')}
        </p>
        <p>
          {[
            tr('Atendimento: {data}', { data: formatDataHoraBR(prontuario.atendimentoIniciadoEm ?? prontuario.createdAt) }),
            prontuario.atendimentoIniciadoEm && tr('Duração: {tempo}', { tempo: formatDuracao(prontuario.atendimentoIniciadoEm, prontuario.atendimentoFinalizadoEm) }),
            tr('Convênio: {nome}', { nome: prontuario.convenioId?.nome ?? tr('Particular') }),
            profissional.nome && tr('Profissional: {nome}', { nome: [profissional.nome, registro].filter(Boolean).join(' · ') }),
          ].filter(Boolean).join('  ·  ')}
        </p>
      </header>

      <div className="pront-impressao__conteudo">
        {preenchidos.length === 0 && !prontuario.cid10 && sinais.length === 0 && (
          <p className="pront-evolucao__vazio">{tr('Atendimento sem anotações registradas.')}</p>
        )}

        {preenchidos.map(([campo, label]) => (
          <section className="pront-texto" key={campo}>
            <span className="pront-texto__rotulo">{label}</span>
            <p>{prontuario[campo]}</p>
          </section>
        ))}

        {prontuario.cid10 && (
          <section className="pront-texto">
            <span className="pront-texto__rotulo">CID-10</span>
            <p>{prontuario.cid10}</p>
          </section>
        )}

        {sinais.length > 0 && (
          <section className="pront-texto">
            <span className="pront-texto__rotulo">{tr('Sinais vitais')}</span>
            <p>{sinais.map(([rotulo, valor]) => `${rotulo}: ${valor}`).join('  ·  ')}</p>
          </section>
        )}

        {prontuario.anexos?.length > 0 && (
          <section className="pront-texto">
            <span className="pront-texto__rotulo">{tr('Anexos')}</span>
            <p>{prontuario.anexos.map((anexo) => anexo.nome).join(', ')}</p>
          </section>
        )}

        {prontuario.proximoRetorno && (
          <p className="pront-retorno">{tr('Próximo retorno:')} <strong>{formatDataBR(prontuario.proximoRetorno)}</strong></p>
        )}

        {adendos.length > 0 && (
          <section className="pront-texto">
            <span className="pront-texto__rotulo">{tr('Adendos')}</span>
            <ol className="pront-adendos">
              {adendos.map((adendo) => (
                <li key={adendo._id} className="pront-adendo">
                  <span className="pront-adendo__meta">
                    {formatDataHoraBR(adendo.criadoEm)} · {adendo.profissionalId?.nome ?? tr('Profissional removido')}
                  </span>
                  <p>{adendo.texto}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      <footer className="pront-impressao__assinatura">
        <div className="pront-impressao__carimbo" aria-hidden="true" />
        <span className="pront-impressao__linha">
          <strong>{profissional.nome ?? tr('Profissional removido')}</strong>
          {registro && <span>{registro}</span>}
          <span>{tr('Assinatura e carimbo do(a) profissional')}</span>
        </span>
        <p className="pront-impressao__impresso">{tr('Impresso em {data}', { data: formatDataHoraBR(new Date()) })}</p>
      </footer>
    </>
  );
}
