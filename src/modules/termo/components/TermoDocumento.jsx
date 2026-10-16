import { tr } from '@/i18n';
import { formatarCpf, formatarDataHora } from '../termo.utils';

// O termo como documento: texto e, depois de assinado, a assinatura com os dados que comprovam quem e quando.
// Usado na página do paciente e na impressão da clínica.
export default function TermoDocumento({ termo, clinica }) {
  const assinatura = termo.assinatura;
  return (
    <article className="termo-doc">
      <header className="termo-doc__cabecalho">
        {clinica && <span className="termo-doc__clinica">{clinica}</span>}
        <h1 className="termo-doc__titulo">{termo.titulo}</h1>
      </header>

      <div className="termo-doc__texto">{termo.texto}</div>

      {assinatura && (
        <section className="termo-doc__assinatura" aria-label={tr('Assinatura')}>
          {assinatura.imagem && <img className="termo-doc__rubrica" src={assinatura.imagem} alt={tr('Assinatura de {nome}', { nome: assinatura.nome })} />}
          <div className="termo-doc__linha" />
          <strong>{assinatura.nome}</strong>
          <span>
            {formatarCpf(assinatura.documento)}
            {' · '}
            {assinatura.relacao === 'responsavel' ? tr('Responsável legal') : tr('Paciente')}
          </span>

          <dl className="termo-doc__prova">
            <div><dt>{tr('Assinado em')}</dt><dd>{formatarDataHora(assinatura.assinadoEm)}</dd></div>
            {assinatura.ip && <div><dt>{tr('IP')}</dt><dd>{assinatura.ip}</dd></div>}
            {assinatura.aparelho && <div className="termo-doc__prova--largo"><dt>{tr('Aparelho')}</dt><dd>{assinatura.aparelho}</dd></div>}
            <div className="termo-doc__prova--largo"><dt>{tr('Código do documento')}</dt><dd className="termo-doc__hash">{termo.hashDocumento}</dd></div>
            <div className="termo-doc__prova--largo"><dt>{tr('Código da assinatura')}</dt><dd className="termo-doc__hash">{assinatura.hashAssinatura}</dd></div>
          </dl>
          <p className="termo-doc__nota">
            {tr('Assinatura eletrônica simples (Lei 14.063/2020), feita pelo link enviado pela clínica. Os códigos acima (SHA-256) mudam se o texto ou a assinatura forem alterados.')}
          </p>
        </section>
      )}
    </article>
  );
}
