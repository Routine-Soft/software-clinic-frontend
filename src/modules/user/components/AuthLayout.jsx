import { Link } from 'react-router-dom'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import IdiomaToggle from '@/components/IdiomaToggle/IdiomaToggle'
import SimboloMarca from '@/components/Marca/SimboloMarca'
import './user.css'
import { useIdioma } from '@/i18n/useIdioma';

export default function AuthLayout({ children, wide = false }) {
  const { t } = useIdioma()
  return (
    <div className="auth-page">
      <div className="auth-bg" aria-hidden="true">
        <span className="auth-blob auth-blob--1" />
        <span className="auth-blob auth-blob--2" />
        <span className="auth-blob auth-blob--3" />
      </div>

      <div className="auth-toggle">
        <IdiomaToggle />
        <ThemeToggle />
      </div>

      <main className={`auth-card glass${wide ? ' auth-card--wide' : ''}`}>
        <Link to="/" className="auth-logo" aria-label={t('auth.layout.irInicio')} title={t('auth.layout.inicio')}>
          <SimboloMarca />
        </Link>
        {children}
      </main>
    </div>
  )
}
