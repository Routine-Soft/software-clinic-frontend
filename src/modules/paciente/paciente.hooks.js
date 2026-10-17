import { useState, useEffect } from "react";
import {
  getAllPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
  adicionarAcompanhamento,
  encerrarAcompanhamento,
} from './paciente.api';

export function usePacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadPacientes() {
      try {
        const { data } = await getAllPacientes();
        if (!ignore) setPacientes(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPacientes();

    return () => { ignore = true; };
  }, []);

  async function refreshPacientes() {
    try {
      const { data } = await getAllPacientes();
      setPacientes(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addPaciente(newPaciente) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createPaciente(newPaciente);
      setSuccessMessage(response.message);
      await refreshPacientes();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editPaciente(id, updatedPaciente) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updatePaciente(id, updatedPaciente);
      setSuccessMessage(response.message);
      await refreshPacientes();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  // Profissionais que acompanham: devolvem o paciente atualizado (com os nomes), ou undefined com erro.
  async function incluirAcompanhamento(id, profissionalId) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await adicionarAcompanhamento(id, profissionalId);
      setSuccessMessage(response.message);
      await refreshPacientes();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function finalizarAcompanhamento(id, acompanhamentoId) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await encerrarAcompanhamento(id, acompanhamentoId);
      setSuccessMessage(response.message);
      await refreshPacientes();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removePaciente(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deletePaciente(id);
      setSuccessMessage(response.message);
      await refreshPacientes();
    } catch (err) {
      setError(err);
    }
  }

  return {
    pacientes,
    loading,
    error,
    successMessage,
    addPaciente,
    editPaciente,
    removePaciente,
    refreshPacientes,
    incluirAcompanhamento,
    finalizarAcompanhamento,
  };
}