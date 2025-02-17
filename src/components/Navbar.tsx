import { AppBar, Button, Icon, styled, Toolbar, Typography } from "@mui/material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import MenuIcon from "@mui/icons-material/Menu";

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const Icons = styled('div')({
  display: 'flex',
  alignItems: 'center',
});


const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ background: 'rgb(0, 0, 0)' }}>
      <StyledToolbar>
        <Icons>
          <MenuIcon />
        </Icons>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>Barbershop UI</Typography>
        <ContentCutIcon sx={{ display: { xs: "block", sm: "none" } }} />
        <Button color="inherit">Sign In</Button>
      </StyledToolbar>
    </AppBar>
  )
}

export default Navbar;