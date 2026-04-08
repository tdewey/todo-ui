import { useState } from 'react';
import type { Todo } from '~/types';
import useDeleteTodo from '~/hooks/useDeleteTodo';
import { useDataContext } from '~/components/Context';

export const useHandlers = (todos: Todo[]) => {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const { deleteTodo } = useDeleteTodo();
  const { showSnackbar } = useDataContext();

  const handleClearCompleted = () => {
    const completed = todos.filter(t => t.isCompleted);
    Promise.all(completed.map(t => new Promise<void>((resolve, reject) => {
      deleteTodo(t.id, { onSuccess: () => resolve(), onError: () => reject() });
    })))
      .then(() => showSnackbar(`Cleared ${completed.length} completed task${completed.length !== 1 ? 's' : ''}`, 'success'))
      .catch(() => showSnackbar('Failed to clear some tasks', 'error'));
    setClearDialogOpen(false);
  };

  return { clearDialogOpen, setClearDialogOpen, handleClearCompleted };
};
