import { useState, useEffect, useCallback } from "react";
import { getAllReunioes, createReuniao, updateReuniao, deleteReuniao } from "./reuniao.api";

export function useReunioes({ dataInicio, dataFim } = {}) {
  const [reunioes, setReunioes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const refreshReunioes = useCallback(async () => {
    try {
      const { data } = await getAllReunioes({ dataInicio, dataFim });
      setReunioes(data);
    } catch (err) {
      setError(err);
    }
  }, [dataInicio, dataFim]);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;
        setLoading(true);
        return getAllReunioes({ dataInicio, dataFim });
      })
      .then((response) => {
        if (ignore || !response) return;
        setReunioes(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [dataInicio, dataFim]);

  function limparAvisos() {
    setError(null);
    setSuccessMessage(null);
  }

  // Cada ação devolve a reunião salva (ou true na exclusão) quando dá certo e undefined quando falha.
  async function executar(acao) {
    limparAvisos();
    try {
      const response = await acao();
      setSuccessMessage(response.message);
      await refreshReunioes();
      return response.data ?? true;
    } catch (err) {
      setError(err);
    }
  }

  return {
    reunioes,
    loading,
    error,
    successMessage,
    addReuniao: (dados) => executar(() => createReuniao(dados)),
    editReuniao: (id, dados) => executar(() => updateReuniao(id, dados)),
    mudarStatus: (id, status) => executar(() => updateReuniao(id, { status })),
    removeReuniao: (id) => executar(() => deleteReuniao(id)),
  };
}
