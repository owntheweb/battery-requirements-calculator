import {
  Container,
  Typography,
  Link,
} from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Container sx={{my: 6}}>
      <Typography
        variant="body2"
        sx={{fontFamily: '"Kode Mono", monospace'}}
      >
        Copyright {new Date().getFullYear()} <Link href="https://linktr.ee/joshgcp">Josh</Link> in cooperation with <Link href="https://interactive.guru">Chris</Link>. Images (sans rechargeable battery) generated with the assistance of AI.
      </Typography>
    </Container>
  );
};

export default Footer;
