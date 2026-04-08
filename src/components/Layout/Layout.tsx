import type { ReactNode } from 'react';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const styles = useStyles();

  return (
    <div id="layout-root" className={styles.root}>
      <Container className={styles.container}>
        {children}
      </Container>
    </div>
  );
}

export default Layout;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  container: {
    maxWidth: '512px !important',
  },
}));
