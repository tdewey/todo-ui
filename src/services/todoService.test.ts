import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from './todoService';

const mockTodos = [
  { id: 1, title: 'Test todo 1', isCompleted: false, createdAt: '', updatedAt: '' },
  { id: 2, title: 'Test todo 2', isCompleted: false, createdAt: '', updatedAt: '' },
];

const mockFetch = (response: Partial<Response>) => {
  globalThis.fetch = jest.fn().mockResolvedValue(response as Response);
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getTodos', () => {
  it('fetches all todos and returns parsed JSON', async () => {
    mockFetch({ ok: true, status: 200, json: async () => mockTodos });

    const result = await getTodos();

    expect(result).toEqual(mockTodos);
  });

  it('appends isCompleted query param when filter provided', async () => {
    mockFetch({ ok: true, status: 200, json: async () => [] });

    await getTodos(false);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('?isCompleted=false'),
      expect.any(Object),
    );
  });
});

describe('getTodoById', () => {
  it('fetches a single todo by id and returns parsed JSON', async () => {
    const mockTodo = mockTodos[0];
    mockFetch({ ok: true, status: 200, json: async () => mockTodo });

    const result = await getTodoById(1);

    expect(result).toEqual(mockTodo);
  });

  it('throws with status when todo is not found', async () => {
    mockFetch({ ok: false, status: 404, json: async () => ({ title: 'Not found' }) });

    await expect(getTodoById(999)).rejects.toMatchObject({ status: 404 });
  });
});

describe('createTodo', () => {
  it('throws with status 400 on validation error', async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: async () => ({ title: 'Validation failed', errors: { Title: ['Required'] } }),
    });

    await expect(createTodo({ title: '' })).rejects.toMatchObject({ status: 400 });
  });
});

describe('updateTodo', () => {
  it('sends a PUT request and returns the updated todo', async () => {
    const updatedTodo = { id: 1, title: 'Updated', isCompleted: true, createdAt: '', updatedAt: '' };
    mockFetch({ ok: true, status: 200, json: async () => updatedTodo });

    const result = await updateTodo(1, { title: 'Updated', isCompleted: true });

    expect(result).toEqual(updatedTodo);
  });

  it('throws with status on failure', async () => {
    mockFetch({ ok: false, status: 400, json: async () => ({ title: 'Bad request' }) });

    await expect(updateTodo(1, { title: '', isCompleted: false })).rejects.toMatchObject({ status: 400 });
  });
});

describe('deleteTodo', () => {
  it('handles 204 NoContent and returns undefined without parsing JSON', async () => {
    const jsonSpy = jest.fn();
    mockFetch({ ok: true, status: 204, json: jsonSpy });

    const result = await deleteTodo(1);

    expect(result).toBeUndefined();
    expect(jsonSpy).not.toHaveBeenCalled();
  });
});
