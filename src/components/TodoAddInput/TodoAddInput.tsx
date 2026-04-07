import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { useHandlers } from './TodoAddInput.handlers';
import './TodoAddInput.scss';

function TodoAddInput() {
  const { inputValue, setInputValue, handleSubmit, handleKeyDown, isCreating } = useHandlers();

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: '10px',
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <IconButton
        size="small"
        onClick={handleSubmit}
        disabled={isCreating}
        aria-label="Add task"
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: '8px',
          '&:hover': { bgcolor: 'primary.main', opacity: 0.8 },
          '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
      <InputBase
        fullWidth
        placeholder="Add a new task..."
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isCreating}
        sx={{ fontSize: '0.875rem' }}
        inputProps={{ 'aria-label': 'New task title' }}
      />
    </Paper>
  );
}

export default TodoAddInput;
