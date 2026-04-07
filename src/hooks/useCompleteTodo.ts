import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeTodo } from '~/services/todoService';

const useCompleteTodo = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: number) => completeTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    completeTodo: mutate,
    isCompleting: isPending,
    completeError: error,
  };
};

export default useCompleteTodo;
