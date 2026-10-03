import { formatDataBR, calcularIdade } from '@/utils/date';
import { resumoDasSessoes } from '../avaliacao-neuro.utils';

function Paragrafos({ texto, vazio }) {
  if (!texto?.trim()) return <p className="laudo-doc__vazio">{vazio}</p>;
  return texto.split(/\n{2,}/).map((bloco, i) => <p key={i}>{bloco}</p>);
}

const dataPorExtenso = (iso) => new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

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
        <h1>Laudo Psicológico</h1>
        <p>Avaliação neuropsicológica</p>
      </header>

      <section>
        <h2>1. Identificação</h2>
        <dl className="laudo-doc__ident">
          <div><dt>Autor(a)</dt><dd>{profissional.nome}{registro && ` — ${registro}`}</dd></div>
          <div>
            <dt>Avaliado(a)</dt>
            <dd>{paciente.nome}{paciente.dataNascimento && ` — nascido(a) em ${formatDataBR(paciente.dataNascimento)}${idade !== null ? ` (${idade} anos)` : ''}`}</dd>
          </div>
          <div><dt>Solicitante</dt><dd>{form.solicitante || '—'}</dd></div>
          <div><dt>Finalidade</dt><dd>{form.finalidade || '—'}</dd></div>
        </dl>
      </section>

      <section>
        <h2>2. Descrição da demanda</h2>
        <Paragrafos texto={form.demanda} vazio="Preencha a descrição da demanda na aba Identificação e demanda." />
      </section>

      <section>
        <h2>3. Procedimento</h2>
        <Paragrafos texto={form.procedimento} vazio="Descreva a fundamentação e os recursos na aba Sessões e procedimento." />
        {sessoes.quantidade > 0 && (
          <p>
            Foram realizadas {sessoes.quantidade} {sessoes.quantidade === 1 ? 'sessão' : 'sessões'}
            {sessoes.primeira && (sessoes.primeira === sessoes.ultima
              ? `, em ${formatDataBR(sessoes.primeira)}`
              : `, entre ${formatDataBR(sessoes.primeira)} e ${formatDataBR(sessoes.ultima)}`)}
            {sessoes.minutos > 0 && `, totalizando ${sessoes.minutos} minutos`}.
          </p>
        )}
        {form.informantes && <p>Informantes: {form.informantes}.</p>}
        {nomesInstrumentos.length > 0 && <p>Instrumentos utilizados: {nomesInstrumentos.join('; ')}.</p>}
      </section>

      <section>
        <h2>4. Análise</h2>
        <Paragrafos texto={form.analise} vazio="Escreva a análise na aba Análise e conclusão." />
        {instrumentos.length > 0 && (
          <table className="laudo-doc__tabela">
            <thead>
              <tr><th>Instrumento</th><th>Domínio</th><th>Escore</th><th>Percentil</th><th>Classificação</th></tr>
            </thead>
            <tbody>
              {instrumentos.map((i, index) => (
                <tr key={index}>
                  <td>{i.nome}</td>
                  <td>{i.dominio || '—'}</td>
                  <td>{[i.escoreBruto && `bruto ${i.escoreBruto}`, i.escorePadrao && `padrão ${i.escorePadrao}`].filter(Boolean).join(' · ') || '—'}</td>
                  <td>{i.percentil !== '' && i.percentil !== null ? i.percentil : '—'}</td>
                  <td>{i.classificacao || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>5. Conclusão</h2>
        {form.hipoteseDiagnostica && (
          <p><strong>Hipótese diagnóstica:</strong> {form.hipoteseDiagnostica}{form.cid && ` (CID ${form.cid})`}</p>
        )}
        <Paragrafos texto={form.conclusao} vazio="Escreva a conclusão na aba Análise e conclusão." />
        {form.encaminhamentos && (
          <>
            <p><strong>Encaminhamentos e orientações:</strong></p>
            <Paragrafos texto={form.encaminhamentos} />
          </>
        )}
      </section>

      <section>
        <h2>6. Referências</h2>
        <Paragrafos texto={form.referencias} vazio="As referências são obrigatórias: preencha na aba Análise e conclusão." />
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
