export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
}

export interface UpdateTodoDto {
  title: string;
  isCompleted: boolean;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  errors?: Record<string, string[]>;
}
