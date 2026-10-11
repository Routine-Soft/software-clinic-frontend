import { Link } from 'react-router-dom'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import SimboloMarca from '@/components/Marca/SimboloMarca'
import './user.css'

export default function AuthLayout({ children, wide = false }) {
  return (
    <div className="auth-page">
      <div className="auth-bg" aria-hidden="true">
        <span className="auth-blob auth-blob--1" />
        <span className="auth-blob auth-blob--2" />
        <span className="auth-blob auth-blob--3" />
      </div>

      <div className="auth-toggle">
        <ThemeToggle />
      </div>

      <main className={`auth-card glass${wide ? ' auth-card--wide' : ''}`}>
        <Link to="/" className="auth-logo" aria-label="Ir para a página inicial da Sonelia" title="Página inicial">
          <SimboloMarca />
        </Link>
        {children}
      </main>
    </div>
  )
}
