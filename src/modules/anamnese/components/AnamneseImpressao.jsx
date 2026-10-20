import { useParams } from 'react-router-dom';
import { IconeImpressora } from '@/components/CrudCard/icones';
import { formatDataBR } from '@/utils/date';
import { useFichaImpressa } from '../anamnese.hooks';
import FichaAnamnese from './FichaAnamnese';
import '../anamnese.css';
import { localeAtual, tr } from '@/i18n';

// Anamnese preenchida em página própria (sem o menu), para imprimir ou salvar em PDF.
// tipo 'prontuario' (#/anamneses/ficha/:id) ou 'neuro' (#/avaliacoes-neuropsicologicas/:id/anamnese).
export default function AnamneseImpressao({ tipo }) {
  const { id } = useParams();
  const { ficha, loading, error } = useFichaImpressa(tipo, id);

  return (
    <div className="anamnese-impressao">
      <div className="anamnese-impressao__barra no-print">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.close()}>{tr('Fechar')}</button>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => window.print()} disabled={!ficha}>
          <IconeImpressora />
          {tr('Imprimir ou salvar em PDF')}
        </button>
      </div>

      <main className="card anamnese-impressao__folha">
        {loading ? (
          <div className="skeleton skeleton--bloco" aria-busy="true" />
        ) : error ? (
          <p className="alert alert--error" role="alert">{error.message}</p>
        ) : (
          <>
            <header className="anamnese-impressao__cab">
              <h1>{ficha.titulo}</h1>
              <p>
                {[
                  ficha.paciente?.nome && tr('Paciente: {nome}', { nome: ficha.paciente.nome }),
                  ficha.paciente?.dataNascimento && tr('Nascimento: {data}', { data: formatDataBR(ficha.paciente.dataNascimento) }),
                  ficha.profissional?.nome && tr('Profissional: {nome}', { nome: [ficha.profissional.nome, ficha.profissional.tipoRegistro && `${ficha.profissional.tipoRegistro} ${ficha.profissional.numeroRegistro}`].filter(Boolean).join(' · ') }),
                  ficha.data && tr('Atualizada em {data}', { data: new Date(ficha.data).toLocaleDateString(localeAtual()) }),
                ].filter(Boolean).join('  ·  ')}
              </p>
            </header>
            <FichaAnamnese secoes={ficha.secoes} respostas={ficha.respostas} somenteLeitura mostrarIndice={false} prefixo="impressao" />
            <div className="anamnese-impressao__assinaturas">
              <span>{tr('Assinatura do(a) profissional')}</span>
              <span>{tr('Assinatura do(a) avaliado(a) ou responsável')}</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
