import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '@/components/Sidebar/Sidebar'
import Marca from '@/components/Sidebar/Marca'
import AssinaturaGuard from '@/modules/assinatura/components/AssinaturaGuard'
import AvisoVencimento from '@/modules/assinatura/components/AvisoVencimento'
import { useAuthContext } from '@/hooks/useAuthContext'
import './MainLayout.css'

export function MainLayout({ children }) {
    const { user } = useAuthContext()
    const [menuAberto, setMenuAberto] = useState(false)

    useEffect(() => {
        if (!menuAberto) return undefined

        const overflowAnterior = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        function handleKeyDown(e) {
            if (e.key === 'Escape') setMenuAberto(false)
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.body.style.overflow = overflowAnterior
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [menuAberto])

    return (
        <div className="app-shell">
            <a className="app-pular" href="#conteudo">Ir para o conteúdo</a>

            <header className="app-topbar">
                <button
                    type="button"
                    className="icon-btn app-topbar__menu"
                    aria-label="Abrir menu"
                    aria-expanded={menuAberto}
                    aria-controls="menu-principal"
                    onClick={() => setMenuAberto(true)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <Link to="/home" className="marca-link" aria-label="Ir para o início">
                    <Marca empresa={user?.nomeEmpresa} />
                </Link>
            </header>

            <Sidebar aberto={menuAberto} onFechar={() => setMenuAberto(false)} />
            {menuAberto && <div className="app-overlay" onClick={() => setMenuAberto(false)} aria-hidden="true" />}

            <main id="conteudo" className="app-main">
                <AvisoVencimento />
                <AssinaturaGuard>{children}</AssinaturaGuard>
            </main>
        </div>
    )
}

export default MainLayout
