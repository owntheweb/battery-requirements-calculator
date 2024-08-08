import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  Box,
} from '@mui/material';
import BatterySaverIcon from '@mui/icons-material/BatterySaver';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../theme';

const TopNav: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box position="static" sx={{bgcolor: 'secondary.main', padding: 1}}>
        <Container sx={{display: 'flex'}}>
          <BatterySaverIcon sx={{mr: 2}} />
          <Typography
            variant="h6"
            component="div"
            sx={{flexGrow: 1, fontFamily: '"Kode Mono", monospace'}}
          >
            Battery Requirements Calculator
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TopNav;
