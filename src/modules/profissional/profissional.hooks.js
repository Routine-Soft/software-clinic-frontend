import { useState, useEffect } from "react";
import {
  getAllProfissionais,
  createProfissional,
  updateProfissional,
  deleteProfissional,
} from "./profissional.api";

export function useProfissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfissionais() {
      try {
        const { data } = await getAllProfissionais();
        if (!ignore) setProfissionais(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProfissionais();

    return () => { ignore = true; };
  }, []);

  async function refreshProfissionais() {
    try {
      const { data } = await getAllProfissionais();
      setProfissionais(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addProfissional(newProfissional) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createProfissional(newProfissional);
      setSuccessMessage(response.message);
      await refreshProfissionais();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editProfissional(id, updatedProfissional) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateProfissional(id, updatedProfissional);
      setSuccessMessage(response.message);
      await refreshProfissionais();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeProfissional(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteProfissional(id);
      setSuccessMessage(response.message);
      await refreshProfissionais();
    } catch (err) {
      setError(err);
    }
  }

  return {
    profissionais,
    loading,
    error,
    successMessage,
    addProfissional,
    editProfissional,
    removeProfissional,
    refreshProfissionais,
  };
}