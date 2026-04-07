import { useQuery } from '@tanstack/react-query';
import { getTodos } from 'services/todoService';
import { TodoFilter } from 'enums';

const filterToParam = (filter: TodoFilter): boolean | undefined => {
  if (filter === TodoFilter.Active) return false;
  if (filter === TodoFilter.Completed) return true;
  return undefined;
};

const useTodos = (filter: TodoFilter = TodoFilter.All) => {
  const isCompleted = filterToParam(filter);
  return useQuery({
    queryKey: ['todos', filter],
    queryFn: () => getTodos(isCompleted),
  });
};

export default useTodos;
