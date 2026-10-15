import { useState, useEffect, useCallback } from "react";
import { getAssinaturaAtual, iniciarCheckoutAssinatura, sincronizarAssinatura, cancelarAssinatura, iniciarCheckoutStripe, abrirPortalStripe } from "./assinatura.api";

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

  async function iniciarCheckout(planoId) {
    setErroAcao(null);
    try {
      setIniciandoCheckout(true);
      // Clínica de fora do Brasil paga pelo Stripe (em dólar); do Brasil, pelo Mercado Pago.
      const { data } = assinatura?.gateway === 'stripe' ? await iniciarCheckoutStripe(planoId) : await iniciarCheckoutAssinatura(planoId);
      window.location.href = data.url;
    } catch (err) {
      setErroAcao(err);
      setIniciandoCheckout(false);
    }
  }

  // Portal do Stripe: trocar o cartão, ver as faturas ou cancelar.
  const [abrindoPortal, setAbrindoPortal] = useState(false);
  async function abrirPortal() {
    setErroAcao(null);
    try {
      setAbrindoPortal(true);
      const { data } = await abrirPortalStripe();
      window.location.href = data.url;
    } catch (err) {
      setErroAcao(err);
      setAbrindoPortal(false);
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
    abrindoPortal,
    abrirPortal,
    erroAcao,
    refreshAssinatura,
    atualizarAssinatura: setAssinatura,
  };
}