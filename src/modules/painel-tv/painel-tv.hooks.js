import { useEffect, useRef, useState } from 'react';
import {
  iniciarPareamento,
  situacaoDoPareamento,
  getTelaDaTv,
  getPaineisTv,
  conectarPainelTv,
  renomearPainelTv,
  desconectarPainelTv,
} from './painel-tv.api';
import { lerChaveDaTv, guardarChaveDaTv, anunciar } from './painel-tv.utils';

// A TV consulta a API a cada poucos segundos: simples e volta sozinha quando o Wi-Fi cai.
const CONSULTAR_A_CADA_MS = 3000;

// --- TVs conectadas (tela da clínica) ---

export function usePaineisTv() {
  const [paineis, setPaineis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    let ignore = false;
    function buscar() {
      return getPaineisTv()
        .then((r) => {
          if (ignore) return;
          setPaineis(r.data);
          setAgora(Date.now());
          setLoading(false);
        })
        .catch((e) => {
          if (ignore) return;
          setErro(e);
          setLoading(false);
        });
    }
    Promise.resolve().then(buscar);
    // Depois de digitar o código, a TV leva alguns segundos para buscar a chave e aparecer como ligada.
    const intervalo = setInterval(buscar, 10000);
    return () => {
      ignore = true;
      clearInterval(intervalo);
    };
  }, []);

  async function executar(acao, aplicar) {
    setErro(null);
    setSucesso(null);
    try {
      const resposta = await acao();
      aplicar(resposta.data);
      setSucesso(resposta.message);
      return true;
    } catch (e) {
      setErro(e);
      return false;
    }
  }

  return {
    paineis,
    loading,
    erro,
    sucesso,
    agora,
    conectar: (dados) => executar(() => conectarPainelTv(dados), (painel) => setPaineis((l) => [...l, painel])),
    renomear: (id, nome) => executar(() => renomearPainelTv(id, nome), (painel) => setPaineis((l) => l.map((p) => (p._id === id ? painel : p)))),
    desconectar: (id) => executar(() => desconectarPainelTv(id), () => setPaineis((l) => l.filter((p) => p._id !== id))),
  };
}

// --- A própria TV ---

// Sem chave: mostra o código e espera a clínica digitar. Com chave: mostra as chamadas e anuncia as novas.
export function usePainelDaTv() {
  const [chave, setChave] = useState(lerChaveDaTv);
  const [pareamento, setPareamento] = useState(null);
  const [tela, setTela] = useState(null);
  const [semConexao, setSemConexao] = useState(false);
  const [somAtivo, setSomAtivo] = useState(false);
  const ultimaAnunciada = useRef(null);
  const somAtivoRef = useRef(false);

  // Conexão por código.
  useEffect(() => {
    if (chave) return undefined;
    let ignore = false;
    let timer;
    let segredo = null;

    function novoCodigo() {
      return iniciarPareamento().then((r) => {
        if (ignore) return;
        segredo = r.data.segredo;
        setPareamento(r.data);
        setSemConexao(false);
      });
    }

    function acompanhar() {
      const passo = segredo ? situacaoDoPareamento(segredo) : novoCodigo();
      passo
        .then((r) => {
          if (ignore || !r?.data?.conectada) return;
          guardarChaveDaTv(r.data.chave);
          setPareamento(null);
          setChave(r.data.chave);
        })
        .catch((e) => {
          if (ignore) return;
          if (e?.status === 410 || e?.status === 400) segredo = null;
          else setSemConexao(true);
        })
        .finally(() => {
          if (!ignore) timer = setTimeout(acompanhar, CONSULTAR_A_CADA_MS);
        });
    }

    Promise.resolve().then(acompanhar);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [chave]);

  // Painel conectado.
  useEffect(() => {
    if (!chave) return undefined;
    let ignore = false;
    let timer;

    function consultar() {
      getTelaDaTv(chave)
        .then((r) => {
          if (ignore) return;
          const ultima = r.data.chamadas[0];
          if (ultima && ultimaAnunciada.current !== ultima.id) {
            // Na primeira consulta só registra a última chamada: abrir o painel não repete o anúncio.
            if (ultimaAnunciada.current !== null && somAtivoRef.current) anunciar(ultima);
            ultimaAnunciada.current = ultima.id;
          } else if (!ultima && ultimaAnunciada.current === null) {
            ultimaAnunciada.current = '';
          }
          setTela(r.data);
          setSemConexao(false);
        })
        .catch((e) => {
          if (ignore) return;
          if (e?.status === 401) {
            guardarChaveDaTv(null);
            setTela(null);
            setChave(null);
            return;
          }
          setSemConexao(true);
        })
        .finally(() => {
          if (!ignore) timer = setTimeout(consultar, CONSULTAR_A_CADA_MS);
        });
    }

    Promise.resolve().then(consultar);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [chave]);

  // O navegador só deixa tocar som e falar depois de um toque na tela (ou do "OK" no controle remoto).
  function ativarSom() {
    somAtivoRef.current = true;
    setSomAtivo(true);
    window.speechSynthesis?.getVoices();
  }

  return { conectada: !!chave, pareamento, tela, semConexao, somAtivo, ativarSom };
}
