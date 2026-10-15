import { formatDataBR, calcularIdade } from '@/utils/date';
import { resumoDasSessoes } from '../avaliacao-neuro.utils';
import { localeAtual, tr } from '@/i18n';

function Paragrafos({ texto, vazio }) {
  if (!texto?.trim()) return <p className="laudo-doc__vazio">{vazio}</p>;
  return texto.split(/\n{2,}/).map((bloco, i) => <p key={i}>{bloco}</p>);
}

const dataPorExtenso = (iso) => new Date(iso).toLocaleDateString(localeAtual(), { day: 'numeric', month: 'long', year: 'numeric' });

// Laudo psicológico nas seis partes da Resolução CFP 06/2019, montado a partir do que foi preenchido.
// A anamnese não entra inteira: a resolução pede só o necessário para responder à demanda (vai na Análise).
export default function LaudoNeuro({ avaliacao, form }) {
  const paciente = avaliacao.pacienteId ?? {};
  const profissional = avaliacao.profissionalId ?? {};
  const registro = [profissional.tipoRegistro, profissional.numeroRegistro].filter(Boolean).join(' ');
  const idade = calcularIdade(paciente.dataNascimento);
  const sessoes = resumoDasSessoes(form.sessoes);
  const instrumentos = form.instrumentos.filter((i) => i.nome?.trim());
  const nomesInstrumentos = [...new Set(instrumentos.map((i) => i.nome.trim()))];
  const dataDoLaudo = avaliacao.finalizadaEm ?? new Date().toISOString();

  return (
    <article className="laudo-doc">
      <header className="laudo-doc__titulo">
        <h1>{tr('Laudo Psicológico')}</h1>
        <p>{tr('Avaliação neuropsicológica')}</p>
      </header>

      <section>
        <h2>{tr('1. Identificação')}</h2>
        <dl className="laudo-doc__ident">
          <div><dt>{tr('Autor(a)')}</dt><dd>{profissional.nome}{registro && ` — ${registro}`}</dd></div>
          <div>
            <dt>{tr('Avaliado(a)')}</dt>
            <dd>{paciente.nome}{paciente.dataNascimento && tr(' — nascido(a) em {p0}{p1}', { p0: formatDataBR(paciente.dataNascimento), p1: idade !== null ? tr(' ({idade} anos)', { idade }) : '' })}</dd>
          </div>
          <div><dt>{tr('Solicitante')}</dt><dd>{form.solicitante || '—'}</dd></div>
          <div><dt>{tr('Finalidade')}</dt><dd>{form.finalidade || '—'}</dd></div>
        </dl>
      </section>

      <section>
        <h2>{tr('2. Descrição da demanda')}</h2>
        <Paragrafos texto={form.demanda} vazio={tr('Preencha a descrição da demanda na aba Identificação e demanda.')} />
      </section>

      <section>
        <h2>{tr('3. Procedimento')}</h2>
        <Paragrafos texto={form.procedimento} vazio={tr('Descreva a fundamentação e os recursos na aba Sessões e procedimento.')} />
        {sessoes.quantidade > 0 && (
          <p>
            {tr('Foram realizadas {quantidade} {p0} {p1} {p2}.', { quantidade: sessoes.quantidade, p0: sessoes.quantidade === 1 ? tr('sessão') : tr('sessões'), p1: sessoes.primeira && (sessoes.primeira === sessoes.ultima
              ? tr(', em {p0}', { p0: formatDataBR(sessoes.primeira) })
              : tr(', entre {p0} e {p1}', { p0: formatDataBR(sessoes.primeira), p1: formatDataBR(sessoes.ultima) })), p2: sessoes.minutos > 0 && tr(', totalizando {minutos} minutos', { minutos: sessoes.minutos }) })}
          </p>
        )}
        {form.informantes && <p>{tr('Informantes: {informantes}.', { informantes: form.informantes })}</p>}
        {nomesInstrumentos.length > 0 && <p>{tr('Instrumentos utilizados: {p0}.', { p0: nomesInstrumentos.join('; ') })}</p>}
      </section>

      <section>
        <h2>{tr('4. Análise')}</h2>
        <Paragrafos texto={form.analise} vazio={tr('Escreva a análise na aba Análise e conclusão.')} />
        {instrumentos.length > 0 && (
          <table className="laudo-doc__tabela">
            <thead>
              <tr><th>{tr('Instrumento')}</th><th>{tr('Domínio')}</th><th>{tr('Escore')}</th><th>{tr('Percentil')}</th><th>{tr('Classificação')}</th></tr>
            </thead>
            <tbody>
              {instrumentos.map((i, index) => (
                <tr key={index}>
                  <td>{i.nome}</td>
                  <td>{i.dominio || '—'}</td>
                  <td>{[i.escoreBruto && `bruto ${i.escoreBruto}`, i.escorePadrao && tr('padrão {escorePadrao}', { escorePadrao: i.escorePadrao })].filter(Boolean).join(' · ') || '—'}</td>
                  <td>{i.percentil !== '' && i.percentil !== null ? i.percentil : '—'}</td>
                  <td>{i.classificacao || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>{tr('5. Conclusão')}</h2>
        {form.hipoteseDiagnostica && (
          <p><strong>{tr('Hipótese diagnóstica:')}</strong> {form.hipoteseDiagnostica}{form.cid && tr(' (CID {cid})', { cid: form.cid })}</p>
        )}
        <Paragrafos texto={form.conclusao} vazio={tr('Escreva a conclusão na aba Análise e conclusão.')} />
        {form.encaminhamentos && (
          <>
            <p><strong>{tr('Encaminhamentos e orientações:')}</strong></p>
            <Paragrafos texto={form.encaminhamentos} />
          </>
        )}
      </section>

      <section>
        <h2>{tr('6. Referências')}</h2>
        <Paragrafos texto={form.referencias} vazio={tr('As referências são obrigatórias: preencha na aba Análise e conclusão.')} />
      </section>

      <footer className="laudo-doc__assinatura">
        <p>{dataPorExtenso(dataDoLaudo)}.</p>
        <div className="laudo-doc__linha" />
        <p><strong>{profissional.nome}</strong></p>
        {registro && <p>{registro}</p>}
      </footer>
    </article>
  );
}
