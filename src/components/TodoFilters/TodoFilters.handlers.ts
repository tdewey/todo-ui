import { useContext } from 'react';
import type { MouseEvent } from 'react';
import { DataContext } from '~/components/Context';
import type { TodoFilter } from '~/enums';

export const useHandlers = () => {
  const { setFilter } = useContext(DataContext);

  const handleFilterChange = (_event: MouseEvent<HTMLElement>, newFilter: TodoFilter | null) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  return { handleFilterChange };
};
