import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme } from '~/theme';
import { DataProvider } from '~/components/Context';
import * as todoService from '~/services/todoService';
import TodoAddInput from './TodoAddInput';

jest.mock('~/services/todoService');

const renderWithProviders = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <StylesThemeProvider theme={lightTheme}>
          <MemoryRouter>
            <DataProvider>
              <TodoAddInput />
            </DataProvider>
          </MemoryRouter>
        </StylesThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  (todoService.createTodo as jest.Mock).mockResolvedValue({
    id: 1,
    title: 'My task',
    isCompleted: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  });
});

describe('TodoAddInput', () => {
  it('does not submit when input is empty', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(todoService.createTodo).not.toHaveBeenCalled();
  });

  it('submits on Enter key with valid title', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    await user.type(screen.getByRole('textbox', { name: 'New task title' }), 'My task{Enter}');
    await waitFor(() => {
      expect(todoService.createTodo).toHaveBeenCalledWith({ title: 'My task' });
    });
  });

  it('clears input after successful submission', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    const input = screen.getByRole('textbox', { name: 'New task title' });
    await user.type(input, 'My task{Enter}');
    await waitFor(() => expect(input).toHaveValue(''));
  });
});
