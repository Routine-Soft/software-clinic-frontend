import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import SimboloMarca from '@/components/Marca/SimboloMarca';
import { EMPRESA, VERSAO, CONTATO } from './termos.dados';
import { TERMOS_EN, AVISO_TRADUCAO } from './termos.en';
import IdiomaToggle from '@/components/IdiomaToggle/IdiomaToggle';
import { LINK_WHATSAPP_SITE as LINK_WHATSAPP } from '@/utils/whatsappSite';
import './termos.css';
import { tr, idiomaAtual } from '@/i18n';

// Página pública com um termo (clínica, afiliado, privacidade ou exclusão de dados).
export default function TermosPagina({ termos: termosPt }) {
  const emIngles = idiomaAtual() === 'en' && TERMOS_EN.has(termosPt);
  const termos = emIngles ? { ...TERMOS_EN.get(termosPt), versao: termosPt.versao } : termosPt;
  const identificacao = [EMPRESA.razaoSocial, EMPRESA.cnpj && `CNPJ ${EMPRESA.cnpj}`].filter(Boolean).join(' · ');

  return (
    <div className="termos">
      <header className="termos__topo">
        <Link to="/" className="termos__marca" aria-label={tr('Página inicial da Sonelia')}>
          <span className="termos__selo"><SimboloMarca /></span>
          Sonelia
        </Link>
        <div className="termos__toggles">
          <IdiomaToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="termos__conteudo card">
        <p className="termos__versao">{tr('Versão de {p0}', { p0: termos.versao ?? VERSAO })}</p>
        <h1>{termos.titulo}</h1>
        <p className="termos__subtitulo">{termos.subtitulo}</p>
        {emIngles && <p className="alert alert--info">{AVISO_TRADUCAO}</p>}

        {termos.secoes.map(([titulo, paragrafos]) => (
          <section key={titulo}>
            <h2>{titulo}</h2>
            {paragrafos.map((texto) => <p key={texto.slice(0, 40)}>{texto}</p>)}
          </section>
        ))}

        <section>
          <h2>{tr('Contato')}</h2>
          <p>
            {identificacao && <>{identificacao}. </>}
            {tr('Dúvidas e pedidos:')} {EMPRESA.email && <><a className="link" href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> {tr('ou')} </>}
            {tr('WhatsApp')} <a className="link" href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer">{CONTATO.whatsapp}</a>.
            {EMPRESA.cidadeForo && tr(' Fica eleito o foro da comarca de {cidadeForo} para resolver qualquer questão sobre estes termos.', { cidadeForo: EMPRESA.cidadeForo })}
          </p>
        </section>
      </main>
    </div>
  );
}
