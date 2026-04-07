import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDataContext } from '~/components/Context';
import { TodoFilter } from '~/enums';
import { useHandlers } from './TodoFilters.handlers';
import './TodoFilters.scss';

function TodoFilters() {
  const { filter } = useDataContext();
  const { handleFilterChange } = useHandlers();

  return (
    <Box sx={{ bgcolor: 'action.hover', borderRadius: '10px', p: '4px', display: 'flex' }}>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        fullWidth
        sx={{
          '& .MuiToggleButton-root': {
            flex: 1,
            border: 'none',
            borderRadius: '8px !important',
            fontSize: '0.75rem',
            py: 0.75,
            color: 'text.secondary',
            '&.Mui-selected': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' },
            },
            '&:hover': { bgcolor: 'transparent' },
          },
        }}
      >
        <ToggleButton value={TodoFilter.All}>All</ToggleButton>
        <ToggleButton value={TodoFilter.Active}>Active</ToggleButton>
        <ToggleButton value={TodoFilter.Completed}>Completed</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default TodoFilters;
