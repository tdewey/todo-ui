import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme } from '~/theme';
import { DataProvider } from '~/components/Context';
import useDeleteTodo from '~/hooks/useDeleteTodo';
import type { Todo } from '~/types';
import TodoList from './TodoList';

jest.mock('~/hooks/useDeleteTodo');

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
  (useDeleteTodo as jest.Mock).mockReturnValue({ deleteTodo: noop, isDeleting: false });

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

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
        <MemoryRouter>
          <DataProvider>
            <TodoList {...defaultProps} {...props} />
          </DataProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => jest.clearAllMocks());

describe('TodoList', () => {
  it('shows skeletons while loading', () => {
    renderWithProviders({ isLoading: true });
    expect(document.querySelectorAll('.MuiSkeleton-root').length).toBe(3);
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
});
