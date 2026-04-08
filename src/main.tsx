/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import StyledEngineProvider from '@mui/material/StyledEngineProvider'
import { ThemeProvider as StylesThemeProvider } from '@mui/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { DataContext, DataProvider } from '~/components/Context'
import { lightTheme, darkTheme } from './theme'
import App from './App'
import './main.scss'

const queryClient = new QueryClient()

function ThemedApp() {
  const { mode } = useContext(DataContext)
  const theme = mode === 'dark' ? darkTheme : lightTheme
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <StylesThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StylesThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <ThemedApp />
      </DataProvider>
    </QueryClientProvider>
  </StrictMode>,
)
