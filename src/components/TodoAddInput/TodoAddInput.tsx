import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { useHandlers } from './TodoAddInput.handlers';
import './TodoAddInput.scss';

function TodoAddInput() {
  const styles = useStyles();
  const { inputValue, setInputValue, handleSubmit, handleKeyDown, isCreating } = useHandlers();

  return (
    <Paper id="todo-add-input" variant="outlined" className={styles.paper}>
      <IconButton
        size="small"
        onClick={handleSubmit}
        disabled={isCreating}
        aria-label="Add task"
        className={styles.addButton}
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
        className={styles.input}
        inputProps={{ 'aria-label': 'New task title' }}
      />
    </Paper>
  );
}

export default TodoAddInput;

const useStyles = makeStyles(theme => ({
  paper: {
    borderRadius: '10px !important',
    padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  addButton: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.primary.contrastText} !important`,
    borderRadius: '8px !important',
    '&:hover': {
      opacity: 0.8,
    },
    '&.Mui-disabled': {
      backgroundColor: `${theme.palette.action.disabledBackground} !important`,
    },
  },
  input: {
    fontSize: '0.875rem',
  },
}));
