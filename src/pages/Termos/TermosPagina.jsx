import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import SimboloMarca from '@/components/Marca/SimboloMarca';
import { EMPRESA, VERSAO, CONTATO } from './termos.dados';
import './termos.css';

// Página pública com um termo (clínica, afiliado, privacidade ou exclusão de dados).
export default function TermosPagina({ termos }) {
  const identificacao = [EMPRESA.razaoSocial, EMPRESA.cnpj && `CNPJ ${EMPRESA.cnpj}`].filter(Boolean).join(' · ');

  return (
    <div className="termos">
      <header className="termos__topo">
        <Link to="/" className="termos__marca" aria-label="Página inicial da Sonelia">
          <span className="termos__selo"><SimboloMarca /></span>
          Sonelia
        </Link>
        <ThemeToggle />
      </header>

      <main className="termos__conteudo card">
        <p className="termos__versao">Versão de {termos.versao ?? VERSAO}</p>
        <h1>{termos.titulo}</h1>
        <p className="termos__subtitulo">{termos.subtitulo}</p>

        {termos.secoes.map(([titulo, paragrafos]) => (
          <section key={titulo}>
            <h2>{titulo}</h2>
            {paragrafos.map((texto) => <p key={texto.slice(0, 40)}>{texto}</p>)}
          </section>
        ))}

        <section>
          <h2>Contato</h2>
          <p>
            {identificacao && <>{identificacao}. </>}
            Dúvidas e pedidos: {EMPRESA.email && <><a className="link" href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> ou </>}
            WhatsApp <a className="link" href={CONTATO.linkWhatsapp} target="_blank" rel="noopener noreferrer">{CONTATO.whatsapp}</a>.
            {EMPRESA.cidadeForo && ` Fica eleito o foro da comarca de ${EMPRESA.cidadeForo} para resolver qualquer questão sobre estes termos.`}
          </p>
        </section>
      </main>
    </div>
  );
}
