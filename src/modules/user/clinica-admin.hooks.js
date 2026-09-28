import { useCallback, useEffect, useState } from "react";
import {
  getResumoAdmins,
  getReceitaAdmins,
  getAdmins,
  criarAdmin,
  editarAdmin,
  apagarAdmin,
  trocarPlanoAdmin,
  estenderTesteAdmin,
  definirRevogacaoAdmin,
} from "./clinica-admin.api";

// Números para os cards do painel super admin.
export function useResumoAdmins() {
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const { data } = await getResumoAdmins();
      setResumo(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await getResumoAdmins();
        if (!ignore) setResumo(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return { resumo, loading, error, refresh };
}

// Receita somada (Pix + cartão aprovados) desde o início do período escolhido, para o card do painel super admin.
export function useReceitaAdmins(periodo) {
  const [receita, setReceita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await getReceitaAdmins(periodo);
        if (!ignore) setReceita(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [periodo]);

  return { receita, loading, error };
}

// Lista de clínicas (usuários admin) com a assinatura de cada uma, para a tela de gestão.
export function useAdmins(busca = '') {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const refreshAdmins = useCallback(async () => {
    try {
      const { data } = await getAdmins(busca);
      setAdmins(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [busca]);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;
        setLoading(true);
        return getAdmins(busca);
      })
      .then((response) => {
        if (ignore || !response) return;
        setAdmins(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { ignore = true; };
  }, [busca]);

  async function addAdmin(dados) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await criarAdmin(dados);
      setSuccessMessage(response.message);
      await refreshAdmins();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editAdmin(id, dados) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await editarAdmin(id, dados);
      setSuccessMessage(response.message);
      await refreshAdmins();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeAdmin(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await apagarAdmin(id);
      setSuccessMessage(response.message);
      await refreshAdmins();
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }

  async function trocarPlano(id, planoId) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await trocarPlanoAdmin(id, planoId);
      setSuccessMessage(response.message);
      await refreshAdmins();
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }

  async function estenderTeste(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await estenderTesteAdmin(id);
      setSuccessMessage(response.message);
      await refreshAdmins();
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }

  async function definirRevogacao(id, revogado) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await definirRevogacaoAdmin(id, revogado);
      setSuccessMessage(response.message);
      await refreshAdmins();
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }

  return {
    admins,
    loading,
    error,
    successMessage,
    addAdmin,
    editAdmin,
    removeAdmin,
    trocarPlano,
    estenderTeste,
    definirRevogacao,
    refreshAdmins,
  };
}
