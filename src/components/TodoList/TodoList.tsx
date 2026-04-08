import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ConfirmDialog from '~/components/ConfirmDialog';
import TodoItem from '~/components/TodoItem';
import type { Todo } from '~/types';
import { useHandlers } from './TodoList.handlers';
import './TodoList.scss';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  emptyMessage: string;
}

function TodoList({ todos, isLoading, isError, refetch, emptyMessage }: TodoListProps) {
  const { clearDialogOpen, setClearDialogOpen, handleClearCompleted } = useHandlers(todos);

  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <>
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
