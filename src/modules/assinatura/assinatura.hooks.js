import { useState, useEffect, useCallback } from "react";
import { getAssinaturaAtual, iniciarCheckoutAssinatura } from "./assinatura.api";

export function useAssinatura() {
  const [assinatura, setAssinatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iniciandoCheckout, setIniciandoCheckout] = useState(false);

  const refreshAssinatura = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getAssinaturaAtual();
      setAssinatura(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;
        setLoading(true);
        return getAssinaturaAtual();
      })
      .then((response) => {
        if (ignore || !response) return;
        setAssinatura(response.data);
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

  async function iniciarCheckout() {
    try {
      setIniciandoCheckout(true);
      const { data } = await iniciarCheckoutAssinatura();
      window.location.href = data.url;
    } catch (err) {
      setError(err);
    } finally {
      setIniciandoCheckout(false);
    }
  }

  return {
    assinatura,
    loading,
    error,
    iniciandoCheckout,
    iniciarCheckout,
    refreshAssinatura,
  };
}