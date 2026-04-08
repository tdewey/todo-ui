/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material';
import { TodoFilter } from '~/enums';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface DataContextValue {
  filter: TodoFilter;
  setFilter: (f: TodoFilter) => void;
  mode: 'light' | 'dark';
  toggleMode: () => void;
  showSnackbar: (message: string, severity: AlertColor) => void;
}

export const DataContext = createContext<DataContextValue>({} as DataContextValue);

export const useDataContext = () => useContext(DataContext);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('colorMode') as 'light' | 'dark') ?? 'light',
  );
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const toggleMode = () =>
    setMode(m => {
      const next = m === 'light' ? 'dark' : 'light';
      localStorage.setItem('colorMode', next);
      return next;
    });

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => setSnackbar(state => ({ ...state, open: false }));

  return (
    <DataContext.Provider value={{ filter, setFilter, mode, toggleMode, showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DataContext.Provider>
  );
}
