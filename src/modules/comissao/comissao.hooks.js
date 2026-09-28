import { useCallback, useEffect, useState } from "react";
import {
  getResumoComissoes,
  getPagamentosComissao,
  getPendentesComissao,
  pagarComissao,
  getMinhasComissoes,
} from "./comissao.api";

// Tela do admin: o que cada profissional tem a receber e o histórico de pagamentos.
export function useComissoesClinica() {
  const [resumo, setResumo] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const refresh = useCallback(async () => {
    const [r, p] = await Promise.all([getResumoComissoes(), getPagamentosComissao()]);
    setResumo(r.data);
    setPagamentos(p.data);
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [r, p] = await Promise.all([getResumoComissoes(), getPagamentosComissao()]);
        if (!ignore) {
          setResumo(r.data);
          setPagamentos(p.data);
        }
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  async function pagar(profissionalId) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await pagarComissao(profissionalId);
      setSuccessMessage(response.message);
      await refresh();
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    }
  }

  return { resumo, pagamentos, loading, error, successMessage, pagar };
}

// Atendimentos que entram no próximo pagamento de um profissional (janela de detalhes do admin).
export function usePendentesComissao(profissionalId) {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await getPendentesComissao(profissionalId);
        if (!ignore) setPendentes(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [profissionalId]);

  return { pendentes, loading, error };
}

// Tela do profissional logado. Trocar o período mantém os números antigos na tela até os novos chegarem.
export function useMinhasComissoes(periodo) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await getMinhasComissoes(periodo);
        if (!ignore) setDados(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [periodo]);

  return { dados, loading, error };
}
