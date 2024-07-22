import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../theme';

const TopNav: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const menuItems = ['Top', 'Anchor 1', 'Anchor 2', 'Anchor 3'];

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{bgcolor: 'secondary.main'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{flexGrow: 1, fontFamily: '"Kode Mono", monospace'}}
          >
            Battery Requirements Calculator
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            bgcolor: 'secondary.main',
            color: 'white',
            '& .MuiListItem-root': {
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          },
        }}
      >
        <List>
          {menuItems.map((text) => (
            <ListItemButton
              key={text}
              onClick={toggleDrawer(false)}
              color="white"
            >
              {text}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default TopNav;
