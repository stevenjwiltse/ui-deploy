import { AppBar, Box, Button, Icon, styled, Toolbar, Typography } from "@mui/material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import MenuIcon from "@mui/icons-material/Menu";
import { useKeycloak } from "../hooks/useKeycloak";

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const Icons = styled('div')({
  display: 'flex',
  alignItems: 'center',
});


const Navbar = () => {
  const { keycloak, authenticated } = useKeycloak();

  const handleLogin = () => {
    keycloak?.login();
  };

  const handleLogout = () => {
    keycloak?.logout();
  };


  return (
    <AppBar position="sticky" sx={{ background: 'rgb(0, 0, 0)' }}>
      <StyledToolbar>
        <Icons>
          <MenuIcon />
        </Icons>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>Barbershop UI</Typography>
        <ContentCutIcon sx={{ display: { xs: "block", sm: "none" } }} />
        {authenticated ?
          <Icons>
            <Button color="inherit" onClick={handleLogout}>Sign Out</Button>
          </Icons> :
          <Button color="inherit" onClick={handleLogin}>Sign In</Button>}
      </StyledToolbar>
    </AppBar>
  )
}

export default Navbar;