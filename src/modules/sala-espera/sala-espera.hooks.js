import { useEffect, useState } from 'react';
import { getSalaDeEspera, definirChegada, chamarPaciente } from './sala-espera.api';

// Atualiza sozinha: outro computador (recepção ou consultório) pode marcar chegadas e chamar pacientes.
const ATUALIZAR_A_CADA_MS = 15000;

export function useSalaDeEspera() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [processando, setProcessando] = useState(null);
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    let ignore = false;
    function buscar() {
      return getSalaDeEspera()
        .then((r) => {
          if (ignore) return;
          setAgendas(r.data);
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
    const intervalo = setInterval(buscar, ATUALIZAR_A_CADA_MS);
    return () => {
      ignore = true;
      clearInterval(intervalo);
    };
  }, []);

  async function executar(id, acao) {
    setProcessando(id);
    setErro(null);
    setSucesso(null);
    try {
      const resposta = await acao();
      setAgendas((lista) => lista.map((a) => (a.id === id ? { ...a, ...resposta.data } : a)));
      setAgora(Date.now());
      setSucesso(resposta.message);
    } catch (e) {
      setErro(e);
    } finally {
      setProcessando(null);
    }
  }

  return {
    agendas,
    loading,
    erro,
    sucesso,
    processando,
    agora,
    marcarChegada: (id, chegou = true) => executar(id, () => definirChegada(id, chegou)),
    chamar: (id) => executar(id, () => chamarPaciente(id)),
  };
}
