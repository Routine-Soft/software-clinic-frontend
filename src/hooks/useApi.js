import { useState, useCallback } from 'react'
import apiService from '@/services/httpClient'
import { tr } from '@/i18n';

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true)
    setError(null)

    try {
      let response

      switch (method.toUpperCase()) {
        case 'GET':
          response = await apiService.get(url)
          break
        case 'POST':
          response = await apiService.post(url, data)
          break
        case 'PATCH':
          response = await apiService.patch(url, data)
          break
        case 'PUT':
          response = await apiService.put(url, data)
          break
        case 'DELETE':
          response = await apiService.delete(url)
          break
        default:
          throw new Error(tr('Método HTTP inválido: {method}', { method }))
      }

      return response
    } catch (err) {
      const errorMessage = err.message || tr('Erro na requisição')
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    request,
    loading,
    error,
    clearError,
  }
}

export default useApi