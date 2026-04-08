import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { makeStyles } from '@mui/styles';
import { useDataContext } from '~/components/Context';
import { TodoFilter } from '~/enums';
import { useHandlers } from './TodoFilters.handlers';

function TodoFilters() {
  const styles = useStyles();
  const { filter } = useDataContext();
  const { handleFilterChange } = useHandlers();

  return (
    <div className={styles.container}>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        fullWidth
        className={styles.toggleGroup}
      >
        <ToggleButton value={TodoFilter.All}>All</ToggleButton>
        <ToggleButton value={TodoFilter.Active}>Active</ToggleButton>
        <ToggleButton value={TodoFilter.Completed}>Completed</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default TodoFilters;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.action.hover,
    borderRadius: 10,
    padding: 4,
    display: 'flex',
  },
  toggleGroup: {
    '& .MuiToggleButton-root': {
      flex: 1,
      border: 'none',
      borderRadius: '8px !important',
      fontSize: '0.75rem',
      paddingTop: theme.spacing(0.75),
      paddingBottom: theme.spacing(0.75),
      color: theme.palette.text.secondary,
      '&.Mui-selected': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        '&:hover': {
          backgroundColor: theme.palette.background.paper,
        },
      },
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
}));
