import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'

export function ProtectedRoute({ children, requiredRoles = [] }) {
    const { isAuthenticated, hasRole } = useAuthContext()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
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