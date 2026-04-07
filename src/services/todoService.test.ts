import { getTodos, createTodo, deleteTodo } from './todoService';

const mockTodos = [
  { id: 1, title: 'Test todo', isCompleted: false, createdAt: '', updatedAt: '' },
];

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn().mockResolvedValue(response as Response);
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getTodos', () => {
  it('fetches all todos and returns parsed JSON', async () => {
    mockFetch({ ok: true, status: 200, json: async () => mockTodos });

    const result = await getTodos();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos'),
      expect.objectContaining({ headers: expect.any(Object) }),
    );
    expect(result).toEqual(mockTodos);
  });

  it('appends isCompleted query param when filter provided', async () => {
    mockFetch({ ok: true, status: 200, json: async () => [] });

    await getTodos(false);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('?isCompleted=false'),
      expect.any(Object),
    );
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
