import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme } from '~/theme';
import { DataProvider } from '~/components/Context';
import useCompleteTodo from '~/hooks/useCompleteTodo';
import useUpdateTodo from '~/hooks/useUpdateTodo';
import useDeleteTodo from '~/hooks/useDeleteTodo';
import type { Todo } from '~/types';
import TodoItem from './TodoItem';

jest.mock('~/hooks/useCompleteTodo');
jest.mock('~/hooks/useUpdateTodo');
jest.mock('~/hooks/useDeleteTodo');

const mockCompleteTodo = jest.fn();
const mockUpdateTodo = jest.fn();
const mockDeleteTodo = jest.fn();

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  title: 'Test task',
  isCompleted: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const renderWithProviders = (todo: Todo) => {
  (useCompleteTodo as jest.Mock).mockReturnValue({ completeTodo: mockCompleteTodo, isCompleting: false });
  (useUpdateTodo as jest.Mock).mockReturnValue({ updateTodo: mockUpdateTodo, isUpdating: false });
  (useDeleteTodo as jest.Mock).mockReturnValue({ deleteTodo: mockDeleteTodo, isDeleting: false });

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <DataProvider>
            <TodoItem todo={todo} />
          </DataProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => jest.clearAllMocks());

describe('TodoItem', () => {
  it('renders todo title', () => {
    renderWithProviders(makeTodo({ title: 'Buy groceries' }));
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('completed item shows line-through style', () => {
    renderWithProviders(makeTodo({ isCompleted: true }));
    const title = screen.getByText('Test task');
    expect(title).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('clicking checkbox calls completeTodo for active item', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ isCompleted: false }));
    await user.click(screen.getByRole('checkbox'));
    expect(mockCompleteTodo).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('clicking delete button opens confirm dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo());
    await user.click(screen.getByRole('button', { name: 'Delete task' }));
    expect(screen.getByText('Delete task?')).toBeInTheDocument();
  });

  it('confirming delete calls deleteTodo', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ id: 42 }));
    await user.click(screen.getByRole('button', { name: 'Delete task' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(mockDeleteTodo).toHaveBeenCalledWith(42, expect.any(Object));
  });

  it('double-clicking title shows inline edit input', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ title: 'Edit me' }));
    await user.dblClick(screen.getByText('Edit me'));
    expect(screen.getByDisplayValue('Edit me')).toBeInTheDocument();
  });

  it('pressing Escape in edit input cancels without saving', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ title: 'Original title' }));
    await user.dblClick(screen.getByText('Original title'));
    const input = screen.getByDisplayValue('Original title');
    await user.clear(input);
    await user.type(input, 'Changed{Escape}');
    expect(mockUpdateTodo).not.toHaveBeenCalled();
    expect(screen.getByText('Original title')).toBeInTheDocument();
  });
});
