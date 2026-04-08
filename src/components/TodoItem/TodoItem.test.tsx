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
import TodoItem from './TodoItem';

jest.mock('~/services/todoService');

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  title: 'Test task',
  isCompleted: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const renderWithProviders = (todo: Todo) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <StylesThemeProvider theme={lightTheme}>
          <MemoryRouter>
            <DataProvider>
              <TodoItem todo={todo} />
            </DataProvider>
          </MemoryRouter>
        </StylesThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  (todoService.updateTodo as jest.Mock).mockResolvedValue({
    id: 1,
    title: 'Test task',
    isCompleted: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  });
  (todoService.deleteTodo as jest.Mock).mockResolvedValue(undefined);
});

describe('TodoItem', () => {
  it('renders todo title', () => {
    renderWithProviders(makeTodo({ title: 'Buy groceries' }));
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('completed item shows line-through style', () => {
    renderWithProviders(makeTodo({ isCompleted: true }));
    expect(screen.getByText('Test task')).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('clicking checkbox calls updateTodo with isCompleted toggled', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ isCompleted: false }));
    await user.click(screen.getByRole('checkbox'));
    await waitFor(() => {
      expect(todoService.updateTodo).toHaveBeenCalledWith(1, { title: 'Test task', isCompleted: true });
    });
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
    await waitFor(() => {
      expect(todoService.deleteTodo).toHaveBeenCalledWith(42);
    });
  });

  it('double-clicking title shows inline edit input', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ title: 'Edit me' }));
    await user.dblClick(screen.getByText('Edit me'));
    expect(screen.getByDisplayValue('Edit me')).toBeInTheDocument();
  });

  it('clicking the edit icon button enters edit mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ title: 'Edit me', isCompleted: false }));
    await user.click(screen.getByRole('button', { name: 'Edit task' }));
    expect(screen.getByDisplayValue('Edit me')).toBeInTheDocument();
  });

  it('edit icon button is not shown for completed todos', () => {
    renderWithProviders(makeTodo({ isCompleted: true }));
    expect(screen.queryByRole('button', { name: 'Edit task' })).not.toBeInTheDocument();
  });

  it('pressing Escape in edit input cancels without saving', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ title: 'Original title' }));
    await user.dblClick(screen.getByText('Original title'));
    const input = screen.getByDisplayValue('Original title');
    await user.clear(input);
    await user.type(input, 'Changed{Escape}');
    expect(todoService.updateTodo).not.toHaveBeenCalled();
    expect(screen.getByText('Original title')).toBeInTheDocument();
  });

  it('pressing Enter in edit input saves the updated title', async () => {
    const user = userEvent.setup();
    renderWithProviders(makeTodo({ title: 'Original title' }));
    await user.dblClick(screen.getByText('Original title'));
    const input = screen.getByDisplayValue('Original title');
    await user.clear(input);
    await user.type(input, 'Updated title{Enter}');
    await waitFor(() => {
      expect(todoService.updateTodo).toHaveBeenCalledWith(1, { title: 'Updated title', isCompleted: false });
    });
  });
});
