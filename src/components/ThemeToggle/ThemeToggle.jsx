import { useTheme } from '@/hooks/useTheme'
import './ThemeToggle.css'
import { tr } from '@/i18n';

const OPTIONS = [
    {
        value: 'light',
        label: tr('Tema claro'),
        icon: (
            <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </>
        ),
    },
    {
        value: 'rosa',
        label: tr('Tema rosa'),
        icon: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
    },
    {
        value: 'dark',
        label: tr('Tema escuro'),
        icon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    },
    {
        value: 'system',
        label: tr('Automático (segue o sistema)'),
        icon: (
            <>
                <rect width="20" height="14" x="2" y="3" rx="2" />
                <path d="M8 21h8M12 17v4" />
            </>
        ),
    },
]

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    return (
        <div className="theme-toggle" role="radiogroup" aria-label={tr('Tema da interface')}>
            {OPTIONS.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    data-tema={option.value}
                    role="radio"
                    aria-checked={theme === option.value}
                    aria-label={option.label}
                    title={option.label}
                    className="theme-toggle__btn"
                    onClick={() => setTheme(option.value)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {option.icon}
                    </svg>
                </button>
            ))}
        </div>
    )
}

export default ThemeToggle
