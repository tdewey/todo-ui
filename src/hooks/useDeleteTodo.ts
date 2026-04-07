import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTodo } from '~/services/todoService';

const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return { deleteTodo: mutate, isDeleting: isPending, deleteError: error };
};

export default useDeleteTodo;
