const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

class TokenManager {
  getAccessToken() {
    return localStorage.getItem('accessToken')
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  // Conteúdo do token de acesso (id, role, via...), ou null sem sessão.
  getPayload() {
    try {
      return JSON.parse(atob(this.getAccessToken().split('.')[1]))
    } catch {
      return null
    }
  }

  isTokenExpired(token) {
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}

const tokenManager = new TokenManager()

async function fetchComRetry(url, options, tentativas = 5, atrasoMs = 600) {
  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      return await fetch(url, options)
    } catch (error) {
      if (tentativa === tentativas) throw error
      await new Promise((resolve) => setTimeout(resolve, atrasoMs))
    }
  }
}

async function makeRequest(url, options = {}) {
  const headers = {
    ...options.headers,
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  const accessToken = tokenManager.getAccessToken()
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  try {
    const response = await fetchComRetry(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      const refreshToken = tokenManager.getRefreshToken()
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/users/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          })

          if (refreshResponse.ok) {
            const data = await refreshResponse.json()
            tokenManager.setTokens(data.data.accessToken, refreshToken)

            headers['Authorization'] = `Bearer ${data.data.accessToken}`
            return fetch(`${API_BASE_URL}${url}`, {
              ...options,
              headers,
            })
          } else {
            tokenManager.clearTokens()
            window.location.href = '/login'
          }
        } catch (error) {
          console.error('Erro ao renovar token:', error)
          tokenManager.clearTokens()
          window.location.href = '/login'
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status}`,
      }))
      if (response.status === 402 && errorData.code === 'ASSINATURA_INATIVA') {
        window.dispatchEvent(new CustomEvent('assinatura:inativa', { detail: { motivo: errorData.message } }))
      }

      throw {
        status: response.status,
        code: errorData.code,
        message: errorData.message || 'Erro na requisição',
        data: errorData,
      }
    }

    if (response.status === 204) {
      return {}
    }

    return response.json()
  } catch (error) {
    console.error('Erro na requisição:', error)
    throw error
  }
}

export const httpClient = {
  get: (url) => makeRequest(url, { method: 'GET' }),

  post: (url, body) =>
    makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: (url, body) =>
    makeRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  put: (url, body) =>
    makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: (url, body) =>
    makeRequest(url, {
      method: 'DELETE',
      ...(body ? { body: JSON.stringify(body) } : {}),
    }),

  tokenManager,
}

export default httpClient