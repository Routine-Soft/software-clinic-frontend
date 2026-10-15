import '@fontsource/dm-serif-display/latin-400.css'
import './styles/theme.css'
import './styles/ui.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from '@/context/ThemeContext'
import { IdiomaProvider } from '@/i18n/IdiomaProvider'
import { registrarApp } from '@/utils/instalarApp'
import { capturarCodigoIndicacao } from '@/modules/indicacao/indicacao.utils'
import { iniciarAnalytics } from '@/utils/analytics'

registrarApp()
capturarCodigoIndicacao()
iniciarAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <IdiomaProvider>
        <App />
      </IdiomaProvider>
    </ThemeProvider>
  </StrictMode>,
)
