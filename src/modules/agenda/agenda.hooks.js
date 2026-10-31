import { useState, useEffect, useCallback } from "react";
import {
  getAllAgendas,
  createAgenda,
  updateAgenda,
  definirRealizadoAgenda,
  definirFaltaAgenda,
  cancelarAgenda,
  cancelarGrupoRecorrencia,
  deleteAgenda,
  getAgendaById,
} from './agenda.api';

export function useAgendas(filtros = {}) {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { profissionalId, dataInicio, dataFim } = filtros;

  const refreshAgendas = useCallback(async () => {
    try {
      const { data } = await getAllAgendas({ profissionalId, dataInicio, dataFim });
      setAgendas(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [profissionalId, dataInicio, dataFim]);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;
        setLoading(true);
        return getAllAgendas({ profissionalId, dataInicio, dataFim });
      })
      .then((response) => {
        if (ignore || !response) return;
        setAgendas(response.data);
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
  }, [profissionalId, dataInicio, dataFim]);

  function limparAvisos() {
    setError(null);
    setSuccessMessage(null);
  }

  async function addAgenda(newAgenda) {
    limparAvisos();
    try {
      const response = await createAgenda(newAgenda);
      setSuccessMessage(response.message);
      await refreshAgendas();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editAgenda(id, updatedAgenda) {
    limparAvisos();
    try {
      const response = await updateAgenda(id, updatedAgenda);
      setSuccessMessage(response.message);
      await refreshAgendas();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  // Devolve o agendamento atualizado (para a janela aberta refletir o novo status) ou null se falhar.
  // Depois de finalizar o atendimento no prontuário (a consulta pode virar "realizado" no servidor): atualiza a lista
  // e devolve a consulta como está agora.
  async function recarregarAgenda(id) {
    try {
      const [{ data }] = await Promise.all([getAgendaById(id), refreshAgendas()]);
      return data;
    } catch {
      return null;
    }
  }

  async function marcarRealizado(id, realizado) {
    limparAvisos();
    try {
      const response = await definirRealizadoAgenda(id, realizado);
      setSuccessMessage(response.message);
      await refreshAgendas();
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    }
  }

  async function marcarFalta(id, faltou) {
    limparAvisos();
    try {
      const response = await definirFaltaAgenda(id, faltou);
      setSuccessMessage(response.message);
      await refreshAgendas();
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    }
  }

  async function cancelAgenda(id) {
    limparAvisos();
    try {
      const response = await cancelarAgenda(id);
      setSuccessMessage(response.message);
      await refreshAgendas();
      return true;
    } catch (err) {
      setError(err);
    }
  }

  async function cancelGrupo(grupoRecorrenciaId) {
    limparAvisos();
    try {
      const response = await cancelarGrupoRecorrencia(grupoRecorrenciaId);
      setSuccessMessage(response.message);
      await refreshAgendas();
      return true;
    } catch (err) {
      setError(err);
    }
  }

  async function removeAgenda(id) {
    limparAvisos();
    try {
      const response = await deleteAgenda(id);
      setSuccessMessage(response.message);
      await refreshAgendas();
      return true;
    } catch (err) {
      setError(err);
    }
  }

  return {
    agendas,
    loading,
    error,
    successMessage,
    addAgenda,
    editAgenda,
    marcarRealizado,
    marcarFalta,
    recarregarAgenda,
    cancelAgenda,
    cancelGrupo,
    removeAgenda,
    refreshAgendas,
  };
}