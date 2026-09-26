import { useState, useEffect, useCallback } from "react";
import {
  getAllListaEspera,
  createListaEspera,
  updateListaEspera,
  deleteListaEspera,
} from "./lista-espera.api";

export function useListaEspera(filtros = {}) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { especialidadeId, status } = filtros;

  const refreshItens = useCallback(async () => {
    try {
      const { data } = await getAllListaEspera({ especialidadeId, status });
      setItens(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [especialidadeId, status]);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;
        setLoading(true);
        return getAllListaEspera({ especialidadeId, status });
      })
      .then((response) => {
        if (ignore || !response) return;
        setItens(response.data);
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
  }, [especialidadeId, status]);

  async function addItem(newItem) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createListaEspera(newItem);
      setSuccessMessage(response.message);
      await refreshItens();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editItem(id, updatedItem) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateListaEspera(id, updatedItem);
      setSuccessMessage(response.message);
      await refreshItens();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeItem(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteListaEspera(id);
      setSuccessMessage(response.message);
      await refreshItens();
    } catch (err) {
      setError(err);
    }
  }

  return {
    itens,
    loading,
    error,
    successMessage,
    addItem,
    editItem,
    removeItem,
    refreshItens,
  };
}