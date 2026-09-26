import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
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
        <div className="auth-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
          </svg>
        </div>
        {children}
      </main>
    </div>
  )
}
