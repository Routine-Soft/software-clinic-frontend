import { useState, useEffect } from "react";
import {
  getAllConvenios,
  createConvenio,
  updateConvenio,
  deleteConvenio,
} from "./convenio.api";

export function useConvenios() {
  const [convenios, setConvenios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadConvenios() {
      try {
        const { data } = await getAllConvenios();
        if (!ignore) setConvenios(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadConvenios();

    return () => { ignore = true; };
  }, []);

  async function refreshConvenios() {
    try {
      const { data } = await getAllConvenios();
      setConvenios(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addConvenio(newConvenio) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createConvenio(newConvenio);
      setSuccessMessage(response.message);
      await refreshConvenios();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editConvenio(id, updatedConvenio) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateConvenio(id, updatedConvenio);
      setSuccessMessage(response.message);
      await refreshConvenios();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeConvenio(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteConvenio(id);
      setSuccessMessage(response.message);
      await refreshConvenios();
    } catch (err) {
      setError(err);
    }
  }

  return {
    convenios,
    loading,
    error,
    successMessage,
    addConvenio,
    editConvenio,
    removeConvenio,
    refreshConvenios,
  };
}