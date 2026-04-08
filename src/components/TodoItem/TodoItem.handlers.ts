import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Todo } from '~/types';
import useUpdateTodo from '~/hooks/useUpdateTodo';
import useDeleteTodo from '~/hooks/useDeleteTodo';
import { useDataContext } from '~/components/Context';

export const useHandlers = (todo: Todo) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const { updateTodo } = useUpdateTodo();
  const { deleteTodo } = useDeleteTodo();
  const { showSnackbar } = useDataContext();

  const startEditing = () => {
    setEditingText(todo.title);
    setIsEditing(true);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    const trimmed = editingText.trim();
    if (!trimmed || trimmed === todo.title) {
      setIsEditing(false);
      return;
    }
    updateTodo(
      { id: todo.id, dto: { title: trimmed, isCompleted: todo.isCompleted } },
      {
        onSuccess: () => {
          setIsEditing(false);
          showSnackbar('Task updated', 'success');
        },
        onError: () => {
          setIsEditing(false);
          showSnackbar('Failed to update task', 'error');
        },
      },
    );
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingText('');
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const handleToggleComplete = () => {
    const isCompleted = !todo.isCompleted;
    updateTodo(
      { id: todo.id, dto: { title: todo.title, isCompleted } },
      {
        onSuccess: () => showSnackbar(isCompleted ? 'Task completed' : 'Task reopened', isCompleted ? 'success' : 'info'),
        onError: () => showSnackbar('Failed to update task', 'error'),
      },
    );
  };

  const handleDeleteConfirmed = () => {
    deleteTodo(todo.id, {
      onSuccess: () => showSnackbar('Task deleted', 'success'),
      onError: () => showSnackbar('Failed to delete task', 'error'),
    });
    setDeleteOpen(false);
  };

  return {
    isEditing,
    editingText,
    setEditingText,
    editInputRef,
    deleteOpen,
    setDeleteOpen,
    startEditing,
    commitEdit,
    cancelEdit,
    handleEditKeyDown,
    handleToggleComplete,
    handleDeleteConfirmed,
  };
};
