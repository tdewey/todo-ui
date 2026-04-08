import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme } from '~/theme';
import { DataProvider } from '~/components/Context';
import useCreateTodo from '~/hooks/useCreateTodo';
import TodoAddInput from './TodoAddInput';

jest.mock('~/hooks/useCreateTodo');

const mockCreateTodo = jest.fn();

const renderWithProviders = () => {
  (useCreateTodo as jest.Mock).mockReturnValue({
    createTodo: mockCreateTodo,
    isCreating: false,
    createError: null,
  });

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <DataProvider>
            <TodoAddInput />
          </DataProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TodoAddInput', () => {
  it('does not submit when input is empty', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  it('submits on Enter key with valid title', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    await user.type(screen.getByRole('textbox', { name: 'New task title' }), 'My task{Enter}');
    expect(mockCreateTodo).toHaveBeenCalledWith(
      { title: 'My task' },
      expect.any(Object),
    );
  });
});
