import { useState, useEffect } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  getMe,
  updateMe,
  updateMyPassword,
  getAllUsers,
  getUsersDaClinica,
  createUsuarioDaClinica,
  updateUsuarioDaClinica,
  deleteUsuarioDaClinica,
  resetPasswordUsuarioDaClinica,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
} from "./user.api";

export function useUsuariosDaClinica() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadUsuarios() {
      try {
        const { data } = await getUsersDaClinica();
        if (!ignore) setUsuarios(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadUsuarios();

    return () => { ignore = true; };
  }, []);

  async function refreshUsuarios() {
    try {
      const { data } = await getUsersDaClinica();
      setUsuarios(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addUsuario(newUsuario) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createUsuarioDaClinica(newUsuario);
      setSuccessMessage(response.message);
      await refreshUsuarios();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editUsuario(id, updatedUsuario) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateUsuarioDaClinica(id, updatedUsuario);
      setSuccessMessage(response.message);
      await refreshUsuarios();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeUsuario(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteUsuarioDaClinica(id);
      setSuccessMessage(response.message);
      await refreshUsuarios();
    } catch (err) {
      setError(err);
    }
  }

  async function resetSenhaUsuario(id, novaSenha) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await resetPasswordUsuarioDaClinica(id, novaSenha);
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err);
    }
  }

  return {
    usuarios,
    loading,
    error,
    successMessage,
    addUsuario,
    editUsuario,
    removeUsuario,
    resetSenhaUsuario,
    refreshUsuarios,
  };
}

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const { data } = await getAllUsers();
        if (!ignore) setUsers(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadUsers();

    return () => { ignore = true; };
  }, []);

  async function refreshUsers() {
    try {
      setLoading(true);
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addUser(newUser) {
    try {
      const response = await createUser(newUser);
      setSuccessMessage(response.message);
      await refreshUsers();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editUser(id, updatedUser) {
    try {
      const response = await updateUser(id, updatedUser);
      setSuccessMessage(response.message);
      await refreshUsers();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeUser(id) {
    try {
      const response = await deleteUser(id);
      setSuccessMessage(response.message);
      await refreshUsers();
    } catch (err) {
      setError(err);
    }
  }

  async function changePassword(id, currentPassword, newPassword) {
    try {
      const response = await updatePassword(id, { currentPassword, newPassword });
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err);
    }
  }

  return {
    users,
    loading,
    error,
    successMessage,
    addUser,
    editUser,
    removeUser,
    changePassword,
    refreshUsers,
  };
}

export function useMinhaConta() {
  const { atualizarUsuarioLogado } = useAuthContext();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadPerfil() {
      try {
        const { data } = await getMe();
        if (!ignore) setPerfil(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPerfil();

    return () => { ignore = true; };
  }, []);

  async function salvarPerfil(dados) {
    setError(null);
    try {
      const response = await updateMe(dados);
      setPerfil(response.data);
      atualizarUsuarioLogado(response.data);
      setSuccessMessage(response.message);
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function alterarSenha(dados) {
    setError(null);
    try {
      const response = await updateMyPassword(dados);
      setSuccessMessage(response.message);
      return true;
    } catch (err) {
      setError(err);
    }
  }

  return {
    perfil,
    loading,
    error,
    successMessage,
    salvarPerfil,
    alterarSenha,
  };
}
