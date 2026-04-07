import type { CreateTodoDto, Todo, UpdateTodoDto } from 'types';
import { API_URL } from 'config';

const BASE = API_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const err = res.status !== 204 ? await res.json().catch(() => ({})) : {};
    throw Object.assign(new Error(err.title ?? 'Request failed'), {
      status: res.status,
      data: err,
    });
  }

  return res.status === 204 ? (undefined as T) : res.json();
}

export const getTodos = (isCompleted?: boolean): Promise<Todo[]> => {
  const params =
    isCompleted !== undefined ? `?isCompleted=${isCompleted}` : '';
  return request<Todo[]>(`/api/todos${params}`);
};

export const getTodoById = (id: number): Promise<Todo> =>
  request<Todo>(`/api/todos/${id}`);

export const createTodo = (dto: CreateTodoDto): Promise<Todo> =>
  request<Todo>('/api/todos', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

export const updateTodo = (id: number, dto: UpdateTodoDto): Promise<Todo> =>
  request<Todo>(`/api/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });

export const deleteTodo = (id: number): Promise<void> =>
  request<void>(`/api/todos/${id}`, { method: 'DELETE' });

export const completeTodo = (id: number): Promise<Todo> =>
  request<Todo>(`/api/todos/${id}/complete`, { method: 'PATCH' });
