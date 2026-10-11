import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'

export function ProtectedRoute({ children, requiredRoles = [] }) {
    const { isAuthenticated, hasRole, user } = useAuthContext()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Afiliado não é clínica: qualquer tela que não seja dele (inclusive a página inicial) leva ao painel.
    if (user?.role === 'afiliado' && !requiredRoles.includes('afiliado')) {
        return <Navigate to="/afiliado" replace />
    }

    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) => hasRole(role))
        if (!hasRequiredRole) {
            return <Navigate to="/home" replace />
        }
    }

    return children
}

export default ProtectedRoute