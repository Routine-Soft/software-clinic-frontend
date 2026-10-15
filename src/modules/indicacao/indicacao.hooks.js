import { useEffect, useState } from 'react';
import { getIndicacoes } from './indicacao.api';

export function useIndicacoes() {
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;
        setLoading(true);
        return getIndicacoes();
      })
      .then((response) => {
        if (ignore || !response) return;
        setResumo(response.data);
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
  }, []);

  return { resumo, loading, error };
}
