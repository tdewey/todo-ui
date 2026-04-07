import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import useCreateTodo from '~/hooks/useCreateTodo';
import { useDataContext } from '~/components/Context';

export const useHandlers = () => {
  const [inputValue, setInputValue] = useState('');
  const { createTodo, isCreating } = useCreateTodo();
  const { showSnackbar } = useDataContext();

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    createTodo(
      { title: trimmed },
      {
        onSuccess: () => {
          setInputValue('');
          showSnackbar('Task created', 'success');
        },
        onError: () => showSnackbar('Failed to create task', 'error'),
      },
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return { inputValue, setInputValue, handleSubmit, handleKeyDown, isCreating };
};
