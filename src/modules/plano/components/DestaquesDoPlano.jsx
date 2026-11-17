import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import { CAMINHO_ICONE_WHATSAPP } from '@/utils/contato';
import './destaques-plano.css';

// Ícone piscando dos tópicos em destaque da lista dos planos (o 6º item da linha em `precos.comparacao`).
function IconeDoTopico({ nome }) {
  if (nome === 'whatsapp') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="currentColor" d={CAMINHO_ICONE_WHATSAPP} />
      </svg>
    );
  }
  return <Icone>{ICONES[nome]}</Icone>;
}

// Nome do tópico na lista dos planos. Com ícone, ganha destaque: ícone e nome piscando.
export function TopicoDoPlano({ topico, icone }) {
  if (!icone) return <span>{topico}</span>;
  return (
    <span className={`topico-destaque topico-destaque--${icone}`}>
      <span className="topico-destaque__icone"><IconeDoTopico nome={icone} /></span>
      <span className="topico-destaque__nome">{topico}</span>
    </span>
  );
}

function LogoClaude() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g stroke="#d97757" strokeWidth="2.6" strokeLinecap="round">
        {[0, 30, 60, 90, 120, 150].map((g) => <path key={g} d="M12 3v18" transform={`rotate(${g} 12 12)`} />)}
      </g>
    </svg>
  );
}

function LogoChatGPT() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.7">
        {[0, 60, 120].map((g) => <rect key={g} x="8" y="2.5" width="8" height="19" rx="4" transform={`rotate(${g} 12 12)`} />)}
      </g>
    </svg>
  );
}

function LogoGemini() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="gemini-degrade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4285f4" />
          <stop offset="0.6" stopColor="#9b72cb" />
          <stop offset="1" stopColor="#d96570" />
        </linearGradient>
      </defs>
      <path fill="url(#gemini-degrade)" d="M12 1.5C12.6 7 17 11.4 22.5 12 17 12.6 12.6 17 12 22.5 11.4 17 7 12.6 1.5 12 7 11.4 11.4 7 12 1.5Z" />
    </svg>
  );
}

// Destaque do plano Rede, logo abaixo do nome (no lugar da descrição): atendimento no WhatsApp com IA, com "IA" e os logos piscando.
// Compacto de propósito: na página de preços, a linha do título é dividida pelos quatro cartões.
// `textos` = `landing.precos.ia` ({ antes, sigla, explicacao, com }).
export function SeloIA({ textos }) {
  return (
    <div className="selo-ia">
      <p className="selo-ia__texto">
        {textos.antes} <strong className="selo-ia__sigla">{textos.sigla}</strong>
      </p>
      <div className="selo-ia__rodape">
        <span className="selo-ia__explicacao">{textos.explicacao}</span>
        <ul className="selo-ia__logos" aria-label={textos.com}>
          <li className="selo-ia__logo" title="Claude"><LogoClaude /><span className="selo-ia__nome">Claude</span></li>
          <li className="selo-ia__logo" title="ChatGPT"><LogoChatGPT /><span className="selo-ia__nome">ChatGPT</span></li>
          <li className="selo-ia__logo" title="Gemini"><LogoGemini /><span className="selo-ia__nome">Gemini</span></li>
        </ul>
      </div>
    </div>
  );
}
