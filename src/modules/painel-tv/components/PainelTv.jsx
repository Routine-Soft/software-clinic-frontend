import SimboloMarca from '@/components/Marca/SimboloMarca';
import { usePainelDaTv } from '../painel-tv.hooks';
import { horaCurta } from '../painel-tv.utils';
import Relogio from './Relogio';
import './painel-tv.css';

// Tela aberta na TV da sala de espera (#/tv), sem login. Mostra o código para conectar e, depois, as chamadas.
function TelaDoCodigo({ pareamento, semConexao }) {
  const codigo = pareamento?.codigo ?? '';
  return (
    <main className="tv-codigo">
      <span className="tv-codigo__marca"><SimboloMarca /></span>
      <h1>Conectar esta TV</h1>
      <p>No sistema Sonelia, abra <strong>Sala de espera → TVs</strong> e digite o código:</p>
      <div className="tv-codigo__numero" aria-live="polite">
        {codigo ? `${codigo.slice(0, 3)} ${codigo.slice(3)}` : '··· ···'}
      </div>
      <p className="tv-codigo__dica">
        {semConexao ? 'Sem conexão com a internet. Tentando de novo...' : 'O código muda a cada 10 minutos. Esta tela se atualiza sozinha.'}
      </p>
    </main>
  );
}

function ChamadaAtual({ chamada }) {
  return (
    <section className="tv-atual" aria-live="assertive">
      <span className="tv-atual__rotulo">Chamando agora</span>
      <strong className="tv-atual__nome">{chamada.paciente ?? 'Próximo paciente'}</strong>
      <div className="tv-atual__destino">
        {chamada.sala && <span className="tv-atual__sala">{chamada.sala}</span>}
        {chamada.profissional && <span className="tv-atual__profissional">{chamada.profissional}</span>}
      </div>
    </section>
  );
}

export default function PainelTv() {
  const { conectada, pareamento, tela, semConexao, somAtivo, ativarSom } = usePainelDaTv();

  function iniciar() {
    ativarSom();
    document.documentElement.requestFullscreen?.().catch(() => null);
    navigator.wakeLock?.request('screen').catch(() => null);
  }

  if (!conectada) {
    return (
      <div className="tv">
        <TelaDoCodigo pareamento={pareamento} semConexao={semConexao} />
      </div>
    );
  }

  const [atual, ...anteriores] = tela?.chamadas ?? [];

  return (
    <div className="tv">
      <header className="tv-topo">
        <div className="tv-topo__clinica">
          <span className="tv-topo__marca"><SimboloMarca /></span>
          <span>{tela?.clinica}</span>
        </div>
        <Relogio />
      </header>

      {tela && !tela.liberado ? (
        <main className="tv-vazio">
          <h1>Painel pausado</h1>
          <p>A assinatura da clínica precisa ser regularizada no sistema.</p>
        </main>
      ) : (
        <main className="tv-conteudo">
          {atual ? (
            <ChamadaAtual key={atual.id} chamada={atual} />
          ) : (
            <section className="tv-vazio">
              <h1>Bem-vindo!</h1>
              <p>Aguarde: você será chamado por esta tela.</p>
            </section>
          )}

          <aside className="tv-anteriores" aria-label="Chamadas anteriores">
            <h2>Últimas chamadas</h2>
            {anteriores.length === 0 ? (
              <p className="tv-anteriores__vazio">As chamadas anteriores aparecem aqui.</p>
            ) : (
              <ul>
                {anteriores.map((c) => (
                  <li key={c.id}>
                    <strong>{c.paciente ?? 'Paciente'}</strong>
                    <span>{c.sala}</span>
                    <time>{horaCurta(c.chamadaEm)}</time>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </main>
      )}

      {semConexao && <p className="tv-aviso" role="status">Sem conexão com a internet. Tentando de novo...</p>}

      {!somAtivo && (
        <div className="tv-iniciar">
          <button type="button" className="btn btn--primary tv-iniciar__botao" autoFocus onClick={iniciar}>
            Iniciar painel
          </button>
          <p>Aperte <strong>OK</strong> no controle (ou toque na tela) para ligar o som e a voz das chamadas.</p>
        </div>
      )}
    </div>
  );
}
