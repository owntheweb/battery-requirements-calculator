import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
} from '@mui/material';
import BatterySaverIcon from '@mui/icons-material/BatterySaver';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../theme';

const TopNav: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{bgcolor: 'secondary.main'}}>
        <Toolbar>
          <BatterySaverIcon sx={{mr: 2}} />
          <Typography
            variant="h6"
            component="div"
            sx={{flexGrow: 1, fontFamily: '"Kode Mono", monospace'}}
          >
            Battery Requirements Calculator
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default TopNav;
