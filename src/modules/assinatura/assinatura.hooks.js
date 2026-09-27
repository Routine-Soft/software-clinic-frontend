import { useState, useEffect, useCallback } from "react";
import { getAssinaturaAtual, iniciarCheckoutAssinatura, sincronizarAssinatura, cancelarAssinatura } from "./assinatura.api";

export function useAssinatura() {
  const [assinatura, setAssinatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iniciandoCheckout, setIniciandoCheckout] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [erroAcao, setErroAcao] = useState(null);

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
    setErroAcao(null);
    try {
      setIniciandoCheckout(true);
      const { data } = await iniciarCheckoutAssinatura();
      window.location.href = data.url;
    } catch (err) {
      setErroAcao(err);
      setIniciandoCheckout(false);
    }
  }

  async function cancelar() {
    setErroAcao(null);
    try {
      setCancelando(true);
      const { data } = await cancelarAssinatura();
      setAssinatura(data);
      return true;
    } catch (err) {
      setErroAcao(err);
      return false;
    } finally {
      setCancelando(false);
    }
  }

  // Pergunta ao Mercado Pago (via backend) como está o pagamento e atualiza o cartão.
  async function sincronizar() {
    setErroAcao(null);
    try {
      setSincronizando(true);
      const { data } = await sincronizarAssinatura();
      setAssinatura(data);
    } catch (err) {
      setErroAcao(err);
    } finally {
      setSincronizando(false);
    }
  }

  return {
    assinatura,
    loading,
    error,
    iniciandoCheckout,
    iniciarCheckout,
    sincronizando,
    sincronizar,
    cancelando,
    cancelar,
    erroAcao,
    refreshAssinatura,
  };
}