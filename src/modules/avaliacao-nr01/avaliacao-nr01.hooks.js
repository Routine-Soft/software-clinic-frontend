import { useState, useEffect } from "react";
import {
  getAllAvaliacoesNr01,
  createAvaliacaoNr01,
  updateAvaliacaoNr01,
  deleteAvaliacaoNr01,
} from "./avaliacao-nr01.api";

export function useAvaliacoesNr01() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadAvaliacoes() {
      try {
        const { data } = await getAllAvaliacoesNr01();
        if (!ignore) setAvaliacoes(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadAvaliacoes();

    return () => { ignore = true; };
  }, []);

  async function refreshAvaliacoes() {
    try {
      const { data } = await getAllAvaliacoesNr01();
      setAvaliacoes(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addAvaliacao(newAvaliacao) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createAvaliacaoNr01(newAvaliacao);
      setSuccessMessage(response.message);
      await refreshAvaliacoes();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editAvaliacao(id, updatedAvaliacao) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateAvaliacaoNr01(id, updatedAvaliacao);
      setSuccessMessage(response.message);
      await refreshAvaliacoes();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeAvaliacao(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteAvaliacaoNr01(id);
      setSuccessMessage(response.message);
      await refreshAvaliacoes();
    } catch (err) {
      setError(err);
    }
  }

  return {
    avaliacoes,
    loading,
    error,
    successMessage,
    addAvaliacao,
    editAvaliacao,
    removeAvaliacao,
    refreshAvaliacoes,
  };
}
