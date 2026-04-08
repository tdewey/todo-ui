import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import { MemoryRouter } from 'react-router-dom';
import { lightTheme } from '~/theme';
import { DataProvider } from '~/components/Context';
import TodoFilters from './TodoFilters';

const renderWithProviders = () =>
  render(
    <ThemeProvider theme={lightTheme}>
      <StylesThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <DataProvider>
            <TodoFilters />
          </DataProvider>
        </MemoryRouter>
      </StylesThemeProvider>
    </ThemeProvider>,
  );

describe('TodoFilters', () => {
  it('renders three filter tabs', () => {
    renderWithProviders();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
  });

  it('clicking Active tab marks it as selected', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    await user.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true');
  });
});
