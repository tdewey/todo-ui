import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { makeStyles } from '@mui/styles';
import ConfirmDialog from '~/components/ConfirmDialog';
import type { Todo } from '~/types';
import { useHandlers } from './TodoItem.handlers';

interface TodoItemProps {
  todo: Todo;
}

function TodoItem({ todo }: TodoItemProps) {
  const styles = useStyles();
  const {
    isEditing,
    editingText,
    setEditingText,
    editInputRef,
    deleteOpen,
    setDeleteOpen,
    startEditing,
    commitEdit,
    handleEditKeyDown,
    handleToggleComplete,
    handleDeleteConfirmed,
  } = useHandlers(todo);

  return (
    <>
      <Paper variant="outlined" className={styles.root}>
        <Checkbox
          size="small"
          checked={todo.isCompleted}
          onChange={handleToggleComplete}
          disabled={isEditing}
          className={styles.checkbox}
        />

        {isEditing ? (
          <Input
            fullWidth
            value={editingText}
            onChange={e => setEditingText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={commitEdit}
            inputRef={editInputRef}
            className={styles.editInput}
          />
        ) : (
          <Typography
            component="span"
            onDoubleClick={startEditing}
            className={`${styles.title} ${todo.isCompleted ? styles.titleCompleted : ''}`}
          >
            {todo.title}
          </Typography>
        )}

        {!isEditing && (
          <div className={styles.actions}>
            {!todo.isCompleted && (
              <IconButton
                size="small"
                onClick={startEditing}
                aria-label="Edit task"
                className={styles.actionBtn}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={() => setDeleteOpen(true)}
              aria-label="Delete task"
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </div>
        )}
      </Paper>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete task?"
        message={`"${todo.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}

export default TodoItem;

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '10px !important',
    padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover $actionBtn': {
      opacity: 1,
    },
  },
  checkbox: {
    padding: `${theme.spacing(0.5)} !important`,
    borderRadius: '50% !important',
  },
  title: {
    flex: 1,
    fontSize: '0.875rem',
    cursor: 'text',
    userSelect: 'none',
    color: theme.palette.text.primary,
  },
  titleCompleted: {
    textDecoration: 'line-through',
    color: theme.palette.text.secondary,
  },
  editInput: {
    fontSize: '0.875rem !important',
    '&:before': {
      borderBottomColor: `${theme.palette.primary.main} !important`,
    },
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  actionBtn: {
    opacity: 0,
    transition: 'opacity 0.15s ease',
  },
  deleteBtn: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
}));
