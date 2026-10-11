import { useState } from 'react';
import { Link } from 'react-router-dom';
import CabecalhoSite from '@/pages/Landing/CabecalhoSite';
import CadastroAfiliado from '@/modules/afiliado/components/CadastroAfiliado';
import { formatarReais } from '@/modules/indicacao/indicacao.utils';
import { COMISSAO_PERCENTUAL, PLANOS, PASSOS, PUBLICO, REGRAS, DUVIDAS } from './programa.dados';
import '@/pages/Landing/landing.css';
import './programa.css';

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function irParaCadastro() {
  document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Página pública do programa de afiliados: explica as regras, simula o ganho e termina no cadastro.
export default function ProgramaAfiliados() {
  const [clinicas, setClinicas] = useState(() => Object.fromEntries(PLANOS.map((p, i) => [p.nome, i === 0 ? 10 : 5])));
  const total = PLANOS.reduce((soma, p) => soma + clinicas[p.nome] * p.comissao, 0);
  const exemplos = PLANOS.map((p) => `${formatarReais(p.comissao)} no plano ${p.nome}`).join(' e ');

  return (
    <div className="lp programa">
      <div className="lp-fundo" aria-hidden="true">
        <span className="lp-fundo__mancha lp-fundo__mancha--1" />
        <span className="lp-fundo__mancha lp-fundo__mancha--2" />
      </div>

      <CabecalhoSite />

      <main>
        <section className="lp-container programa__hero">
          <div className="programa__hero-texto">
            <span className="lp-selo">Programa de afiliados</span>
            <h1>Ganhe <span className="lp-degrade">{COMISSAO_PERCENTUAL}%</span> da primeira mensalidade de cada clínica que você indicar</h1>
            <p className="lp-paragrafo">
              Indique a Sonelia para clínicas e consultórios. Quando a clínica assina e paga a primeira mensalidade, você recebe {COMISSAO_PERCENTUAL}% dela por Pix: {exemplos}. Sem limite de indicações.
            </p>
            <div className="programa__hero-acoes">
              <button type="button" className="btn btn--primary lp-btn-grande" onClick={irParaCadastro}>Quero ser afiliado</button>
              <a className="btn btn--ghost lp-btn-grande" href="#/termos-afiliado" target="_blank" rel="noreferrer">Ler os termos</a>
            </div>
          </div>

          <div className="card programa__simulador">
            <span className="programa__simulador-titulo">Simule o seu ganho</span>
            {PLANOS.map((p) => (
              <div key={p.nome} className="programa__simulador-plano">
                <label htmlFor={`programa-clinicas-${p.nome}`}>
                  Clínicas no plano {p.nome}: <strong>{clinicas[p.nome]}</strong>
                  <small>{formatarReais(p.comissao)} cada</small>
                </label>
                <input
                  id={`programa-clinicas-${p.nome}`}
                  type="range"
                  min="0"
                  max="50"
                  value={clinicas[p.nome]}
                  onChange={(e) => setClinicas({ ...clinicas, [p.nome]: Number(e.target.value) })}
                />
              </div>
            ))}
            <strong className="programa__simulador-valor">{formatarReais(total)}</strong>
            <span className="programa__simulador-legenda">em comissões, pagas por Pix</span>
          </div>
        </section>

        <section className="lp-secao lp-secao--destaque">
          <div className="lp-container">
            <header className="lp-secao__cab">
              <h2>Como funciona</h2>
            </header>
            <ol className="programa__passos">
              {PASSOS.map(([titulo, texto], i) => (
                <li key={titulo} className="card">
                  <span className="programa__numero">{i + 1}</span>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="lp-secao">
          <div className="lp-container programa__duas">
            <div>
              <h2 className="programa__h2">Quem pode ser afiliado</h2>
              <p className="lp-paragrafo">Qualquer pessoa com CPF e chave Pix. Quem já trabalha com clínicas leva vantagem: conhece quem precisa organizar a agenda e os prontuários.</p>
              <ul className="programa__publico">
                {PUBLICO.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div className="card programa__regras">
              <h2 className="programa__h2">As regras</h2>
              <ul className="lp-lista-check">
                {REGRAS.map((r) => <li key={r}><Check />{r}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="lp-secao lp-secao--destaque" id="cadastro">
          <div className="lp-container lp-container--estreito">
            <header className="lp-secao__cab">
              <h2>Comece agora</h2>
              <p>Crie a sua conta de afiliado ou ative o programa na conta que você já tem.</p>
            </header>
            <CadastroAfiliado />
          </div>
        </section>

        <section className="lp-secao">
          <div className="lp-container lp-container--estreito">
            <header className="lp-secao__cab">
              <h2>Dúvidas</h2>
            </header>
            <div className="programa__duvidas">
              {DUVIDAS.map(([pergunta, resposta]) => (
                <details key={pergunta} className="card">
                  <summary>{pergunta}</summary>
                  <p>{resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-rodape programa__rodape">
        <div className="lp-container">
          <span>© {new Date().getFullYear()} Sonelia · <Link to="/">Página inicial</Link> · <a href="#/termos-afiliado" target="_blank" rel="noreferrer">Termos do afiliado</a></span>
        </div>
      </footer>
    </div>
  );
}
