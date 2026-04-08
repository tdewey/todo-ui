import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import ConfirmDialog from '~/components/ConfirmDialog';
import TodoItem from '~/components/TodoItem';
import type { Todo } from '~/types';
import { useHandlers } from './TodoList.handlers';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  emptyMessage: string;
}

function TodoList({ todos, isLoading, isError, refetch, emptyMessage }: TodoListProps) {
  const styles = useStyles();
  const { clearDialogOpen, setClearDialogOpen, handleClearCompleted } = useHandlers(todos);

  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <>
      {isLoading && (
        <Stack spacing={1} aria-label="Loading tasks">
          <Skeleton variant="rounded" height={56} className={styles.skeleton} />
          <Skeleton variant="rounded" height={56} className={styles.skeleton} />
          <Skeleton variant="rounded" height={56} className={styles.skeleton} />
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
        <Typography variant="body2" color="text.secondary" className={styles.emptyState}>
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
        <div className={styles.clearFooter}>
          <Button
            variant="text"
            size="small"
            color="error"
            onClick={() => setClearDialogOpen(true)}
          >
            Clear {completedCount} completed
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={clearDialogOpen}
        title="Clear completed tasks?"
        message={`This will delete ${completedCount} completed task${completedCount !== 1 ? 's' : ''}.`}
        confirmLabel="Clear all"
        onConfirm={handleClearCompleted}
        onCancel={() => setClearDialogOpen(false)}
      />
    </>
  );
}

export default TodoList;

const useStyles = makeStyles(theme => ({
  skeleton: {
    borderRadius: '10px !important',
  },
  emptyState: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    textAlign: 'center',
  },
  clearFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(0.5),
  },
}));
