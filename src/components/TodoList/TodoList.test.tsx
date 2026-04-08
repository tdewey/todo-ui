import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme } from '~/theme';
import { DataProvider } from '~/components/Context';
import * as todoService from '~/services/todoService';
import type { Todo } from '~/types';
import TodoList from './TodoList';

jest.mock('~/services/todoService');

const noop = jest.fn();

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  title: 'Test task',
  isCompleted: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const renderWithProviders = (props: Partial<React.ComponentProps<typeof TodoList>> = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const defaultProps = {
    todos: [],
    isLoading: false,
    isError: false,
    refetch: noop,
    emptyMessage: 'No tasks here.',
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <StylesThemeProvider theme={lightTheme}>
          <MemoryRouter>
            <DataProvider>
              <TodoList {...defaultProps} {...props} />
            </DataProvider>
          </MemoryRouter>
        </StylesThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  (todoService.deleteTodo as jest.Mock).mockResolvedValue(undefined);
  (todoService.updateTodo as jest.Mock).mockResolvedValue(undefined);
});

describe('TodoList', () => {
  it('shows loading state while loading', () => {
    renderWithProviders({ isLoading: true });
    expect(screen.getByLabelText('Loading tasks')).toBeInTheDocument();
  });

  it('shows error alert on fetch failure', () => {
    renderWithProviders({ isError: true });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('shows empty state when no todos', () => {
    renderWithProviders({ todos: [], emptyMessage: 'No tasks here.' });
    expect(screen.getByText('No tasks here.')).toBeInTheDocument();
  });

  it('renders todo items when data is present', () => {
    const todos = [makeTodo({ id: 1, title: 'First task' }), makeTodo({ id: 2, title: 'Second task' })];
    renderWithProviders({ todos });
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  it('does not show clear completed button when no completed todos', () => {
    renderWithProviders({ todos: [makeTodo({ isCompleted: false })] });
    expect(screen.queryByRole('button', { name: /Clear \d+ completed/ })).not.toBeInTheDocument();
  });

  it('shows clear completed button when completed todos exist', () => {
    const todos = [makeTodo({ id: 1, isCompleted: true }), makeTodo({ id: 2, isCompleted: false })];
    renderWithProviders({ todos });
    expect(screen.getByRole('button', { name: 'Clear 1 completed' })).toBeInTheDocument();
  });

  it('clicking clear completed button opens confirm dialog', async () => {
    const user = userEvent.setup();
    const todos = [makeTodo({ id: 1, isCompleted: true }), makeTodo({ id: 2, isCompleted: true })];
    renderWithProviders({ todos });
    await user.click(screen.getByRole('button', { name: 'Clear 2 completed' }));
    expect(screen.getByText('Clear completed tasks?')).toBeInTheDocument();
  });

  it('confirming clear completed calls deleteTodo for each completed todo', async () => {
    const user = userEvent.setup();
    const todos = [
      makeTodo({ id: 1, isCompleted: true }),
      makeTodo({ id: 2, isCompleted: true }),
      makeTodo({ id: 3, isCompleted: false }),
    ];
    renderWithProviders({ todos });
    await user.click(screen.getByRole('button', { name: 'Clear 2 completed' }));
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    await waitFor(() => {
      expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
      expect(todoService.deleteTodo).toHaveBeenCalledWith(2);
      expect(todoService.deleteTodo).toHaveBeenCalledTimes(2);
    });
  });
});
