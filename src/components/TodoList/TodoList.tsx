import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useDataContext } from '~/components/Context';
import ConfirmDialog from '~/components/ConfirmDialog';
import TodoAddInput from '~/components/TodoAddInput';
import TodoFilters from '~/components/TodoFilters';
import TodoItem from '~/components/TodoItem';
import { TodoFilter } from '~/enums';
import useTodos from '~/hooks/useTodos';
import { useHandlers } from './TodoList.handlers';
import './TodoList.scss';

function TodoList() {
  const { filter, mode, toggleMode } = useDataContext();
  const { data: todos = [], isLoading, isError, refetch } = useTodos(filter);
  const { data: allTodos = [] } = useTodos(TodoFilter.All);

  const { clearDialogOpen, setClearDialogOpen, handleClearCompleted } = useHandlers(todos);

  const completedCount = todos.filter(t => t.isCompleted).length;
  const activeCount = allTodos.filter(t => !t.isCompleted).length;

  const emptyMessage =
    filter === TodoFilter.Completed ? 'No completed tasks yet.' : 'No tasks here.';

  const statusText =
    activeCount === 0 ? 'All caught up!' : `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;

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

        {isLoading && (
          <Stack spacing={1}>
            <Skeleton variant="rounded" height={56} sx={{ borderRadius: '10px' }} />
            <Skeleton variant="rounded" height={56} sx={{ borderRadius: '10px' }} />
            <Skeleton variant="rounded" height={56} sx={{ borderRadius: '10px' }} />
          </Stack>
        )}

        {isError && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Try again
              </Button>
            }
          >
            Failed to load tasks.
          </Alert>
        )}

        {!isLoading && !isError && todos.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            {emptyMessage}
          </Typography>
        )}

        {!isLoading && !isError && todos.length > 0 && (
          <Stack spacing={1}>
            {todos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </Stack>
        )}

        {completedCount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 0.5 }}>
            <Button
              variant="text"
              size="small"
              color="error"
              onClick={() => setClearDialogOpen(true)}
            >
              Clear {completedCount} completed
            </Button>
          </Box>
        )}
      </Stack>

      <ConfirmDialog
        open={clearDialogOpen}
        title="Clear completed tasks?"
        message={`This will permanently delete ${completedCount} completed task${completedCount !== 1 ? 's' : ''}.`}
        confirmLabel="Clear all"
        onConfirm={handleClearCompleted}
        onCancel={() => setClearDialogOpen(false)}
      />
    </>
  );
}

export default TodoList;
