import { useState } from 'react'
import httpClient from '@/services/httpClient'
import { loginUser, logoutUser } from '@/modules/user/user.api'

const CURRENT_USER_KEY = 'currentUser'

export function useAuth() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem(CURRENT_USER_KEY)
        return stored ? JSON.parse(stored) : null
    })
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = httpClient.tokenManager.getAccessToken()
        return !!token && !httpClient.tokenManager.isTokenExpired(token)
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function login(email, password) {
        try {
            setLoading(true)
            setError(null)

            const response = await loginUser({ email, password })
            const { accessToken, refreshToken, user: loggedUser } = response.data

            httpClient.tokenManager.setTokens(accessToken, refreshToken)
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedUser))

            setUser(loggedUser)
            setIsAuthenticated(true)

            return loggedUser
        } catch (err) {
            setError(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        try {
            await logoutUser()
        } catch (err) {
            console.error('Erro ao fazer logout no backend:', err)
        } finally {
            httpClient.tokenManager.clearTokens()
            localStorage.removeItem(CURRENT_USER_KEY)
            setUser(null)
            setIsAuthenticated(false)
        }
    }

    function atualizarUsuarioLogado(dados) {
        const atualizado = { ...user, ...dados }
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(atualizado))
        setUser(atualizado)
    }

    // TEMPORÁRIO (testes): o super_admin passa em qualquer checagem de perfil, para ver todas as telas.
    // Para voltar ao normal, troque por: return user?.role === role
    function hasRole(role) {
        return user?.role === 'super_admin' || user?.role === role
    }

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        hasRole,
        atualizarUsuarioLogado,
    }
}

export default useAuth