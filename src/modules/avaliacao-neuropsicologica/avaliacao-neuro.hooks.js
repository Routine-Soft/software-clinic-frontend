import { useEffect, useState } from 'react';
import { getAvaliacoesNeuro, getAvaliacaoNeuro } from './avaliacao-neuro.api';

export function useAvaliacoesNeuro() {
  const [estado, setEstado] = useState({ avaliacoes: [], loading: true, error: null });

  useEffect(() => {
    let ignore = false;

    getAvaliacoesNeuro()
      .then((response) => { if (!ignore) setEstado({ avaliacoes: response.data, loading: false, error: null }); })
      .catch((err) => { if (!ignore) setEstado({ avaliacoes: [], loading: false, error: err }); });

    return () => { ignore = true; };
  }, []);

  return estado;
}

// Uma avaliação aberta no editor; `setAvaliacao` troca pela versão salva que o servidor devolve.
export function useAvaliacaoNeuro(id) {
  const [estado, setEstado] = useState({ id: null, avaliacao: null, error: null });

  useEffect(() => {
    let ignore = false;

    getAvaliacaoNeuro(id)
      .then((response) => { if (!ignore) setEstado({ id, avaliacao: response.data, error: null }); })
      .catch((err) => { if (!ignore) setEstado({ id, avaliacao: null, error: err }); });

    return () => { ignore = true; };
  }, [id]);

  return {
    avaliacao: estado.avaliacao,
    loading: estado.id !== id,
    error: estado.error,
    setAvaliacao: (avaliacao) => setEstado({ id, avaliacao, error: null }),
  };
}
