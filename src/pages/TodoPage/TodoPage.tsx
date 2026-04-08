import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useDataContext } from '~/components/Context';
import TodoAddInput from '~/components/TodoAddInput';
import TodoFilters from '~/components/TodoFilters';
import TodoList from '~/components/TodoList';
import { TodoFilter } from '~/enums';
import useTodos from '~/hooks/useTodos';

function TodoPage() {
  const { filter, mode, toggleMode } = useDataContext();
  const { data: todos = [], isLoading, isError, refetch } = useTodos(filter);
  const { data: allTodos = [] } = useTodos(TodoFilter.All);

  const activeCount = allTodos.filter(t => !t.isCompleted).length;
  const statusText = activeCount === 0
    ? 'All caught up!'
    : `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
  const emptyMessage = filter === TodoFilter.Completed
    ? 'No completed tasks yet.'
    : 'No tasks here.';

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" fontWeight="bold">
          My Tasks
        </Typography>
        <IconButton onClick={toggleMode} aria-label="Toggle dark mode">
          {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {statusText}
      </Typography>

      <Stack spacing={1.5}>
        <TodoAddInput />
        <TodoFilters />
        <TodoList
          todos={todos}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          emptyMessage={emptyMessage}
        />
      </Stack>
    </>
  );
}

export default TodoPage;
