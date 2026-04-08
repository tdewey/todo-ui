import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '~/constants';
import { createTodo } from '~/services/todoService';
import type { CreateTodoDto } from '~/types';

const useCreateTodo = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (dto: CreateTodoDto) => createTodo(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.todos] });
    },
  });

  return { createTodo: mutate, isCreating: isPending, createError: error };
};

export default useCreateTodo;
