import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme } from '~/theme';
import { DataProvider } from '~/components/Context';
import useTodos from '~/hooks/useTodos';
import useCreateTodo from '~/hooks/useCreateTodo';
import useDeleteTodo from '~/hooks/useDeleteTodo';
import type { Todo } from '~/types';
import TodoList from './TodoList';

jest.mock('~/hooks/useTodos');
jest.mock('~/hooks/useCreateTodo');
jest.mock('~/hooks/useDeleteTodo');

const noop = jest.fn();

const mockUseTodos = useTodos as jest.Mock;

const defaultMutationHook = { createTodo: noop, isCreating: false, createError: null };
const defaultDeleteHook = { deleteTodo: noop, isDeleting: false, deleteError: null };

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  title: 'Test task',
  isCompleted: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const renderWithProviders = () => {
  (useCreateTodo as jest.Mock).mockReturnValue(defaultMutationHook);
  (useDeleteTodo as jest.Mock).mockReturnValue(defaultDeleteHook);

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <DataProvider>
            <TodoList />
          </DataProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TodoList', () => {
  it('shows skeletons while loading', () => {
    mockUseTodos.mockReturnValue({ data: [], isLoading: true, isError: false, refetch: noop });
    renderWithProviders();
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(3);
  });

  it('shows error alert on fetch failure', () => {
    mockUseTodos.mockReturnValue({ data: [], isLoading: false, isError: true, refetch: noop });
    renderWithProviders();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('shows empty state when no todos', () => {
    mockUseTodos.mockReturnValue({ data: [], isLoading: false, isError: false, refetch: noop });
    renderWithProviders();
    expect(screen.getByText('No tasks here.')).toBeInTheDocument();
  });

  it('renders todo items when data is present', () => {
    const todos = [makeTodo({ id: 1, title: 'First task' }), makeTodo({ id: 2, title: 'Second task' })];
    mockUseTodos.mockReturnValue({ data: todos, isLoading: false, isError: false, refetch: noop });
    renderWithProviders();
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });
});
