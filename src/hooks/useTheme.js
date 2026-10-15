import { useContext } from 'react'
import ThemeContext from '@/context/ThemeContext'
import { tr } from '@/i18n';

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error(tr('useTheme deve ser usado dentro de ThemeProvider'))
    }
    return context
}

export default useTheme
