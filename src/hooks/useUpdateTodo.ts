import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '~/constants';
import { updateTodo } from '~/services/todoService';
import type { UpdateTodoDto } from '~/types';

const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateTodoDto }) =>
      updateTodo(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.todos] });
    },
  });

  return { updateTodo: mutate, isUpdating: isPending, updateError: error };
};

export default useUpdateTodo;
