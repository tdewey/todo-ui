import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ConfirmDialog from '~/components/ConfirmDialog';
import type { Todo } from '~/types';
import { useHandlers } from './TodoItem.handlers';
import './TodoItem.scss';

interface TodoItemProps {
  todo: Todo;
}

function TodoItem({ todo }: TodoItemProps) {
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
      <Paper
        variant="outlined"
        className="todo-item-root"
        sx={{
          borderRadius: '10px',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Checkbox
          size="small"
          checked={todo.isCompleted}
          onChange={handleToggleComplete}
          disabled={isEditing}
          sx={{ p: 0.5, borderRadius: '50%' }}
        />

        {isEditing ? (
          <Input
            fullWidth
            value={editingText}
            onChange={e => setEditingText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={commitEdit}
            inputRef={editInputRef}
            sx={{
              fontSize: '0.875rem',
              '&:before': { borderBottomColor: 'primary.main' },
            }}
          />
        ) : (
          <Typography
            component="span"
            onDoubleClick={startEditing}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              textDecoration: todo.isCompleted ? 'line-through' : 'none',
              color: todo.isCompleted ? 'text.secondary' : 'text.primary',
              cursor: 'text',
              userSelect: 'none',
            }}
          >
            {todo.title}
          </Typography>
        )}

        {!isEditing && (
          <Box className="todo-item-actions" sx={{ display: 'flex', gap: 0.5 }}>
            {!todo.isCompleted && (
              <IconButton
                size="small"
                onClick={startEditing}
                aria-label="Edit task"
                className="action-btn"
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={() => setDeleteOpen(true)}
              aria-label="Delete task"
              className="action-btn"
              sx={{ '&:hover': { color: 'error.main' } }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
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
