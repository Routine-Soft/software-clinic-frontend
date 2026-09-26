import { useState, useEffect } from "react";
import {
  getAllSalas,
  createSala,
  updateSala,
  deleteSala,
} from "./sala.api";

export function useSalas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadSalas() {
      try {
        const { data } = await getAllSalas();
        if (!ignore) setSalas(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadSalas();

    return () => { ignore = true; };
  }, []);

  async function refreshSalas() {
    try {
      const { data } = await getAllSalas();
      setSalas(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addSala(newSala) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createSala(newSala);
      setSuccessMessage(response.message);
      await refreshSalas();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editSala(id, updatedSala) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateSala(id, updatedSala);
      setSuccessMessage(response.message);
      await refreshSalas();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeSala(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteSala(id);
      setSuccessMessage(response.message);
      await refreshSalas();
    } catch (err) {
      setError(err);
    }
  }

  return {
    salas,
    loading,
    error,
    successMessage,
    addSala,
    editSala,
    removeSala,
    refreshSalas,
  };
}