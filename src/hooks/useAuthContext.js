import { useContext } from 'react'
import AuthContext from '@/context/AuthContext'
import { tr } from '@/i18n';

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error(tr('useAuthContext deve ser usado dentro de AuthProvider'))
    }
    return context
}

export default useAuthContext