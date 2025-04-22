import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useKeycloak } from "../hooks/useKeycloak";
import { useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Icons = styled("div")({
  display: "flex",
  alignItems: "center",
});

export type NavItemsType = {
  name: string;
  link: string;
}

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  navItems: NavItemsType[];
}

const drawerWidth = 240;

const Navbar = (props: Props) => {
  const { keycloak, authenticated } = useKeycloak();

  const handleLogin = () => {
    keycloak?.login();
  };

  const getUserName = () => {
    return keycloak?.idTokenParsed?.name.split(" ")[0];
  };

  const handleLogout = () => {
    keycloak?.logout();
  };

  const navigate = useNavigate();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseUserMenu();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {props.navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} href={item.link}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
         
        <Divider variant="middle" component="li" />
       
        {authenticated ? (
          <Box>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }} onClick={() => handleNavigate("/profile")}>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ textAlign: "center" }}>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
          </Box>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogin} sx={{ textAlign: "center" }}>
              <ListItemText primary="Sign In / Sign Up" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <AppBar position="sticky" sx={{ background: "rgb(0, 0, 0)" }}>
        <StyledToolbar>
          <Box
            component="img"
            src="/img/logo-inverted.png"
            alt="barbershop-logo"
            sx={{ width: { xs: 100, sm: 125, md: 150 } }}
          >
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: "block" } }}>
            {props.navItems.map((item) => (
              <Button key={item.name} sx={{ color: '#fff' }} href={item.link}>
                {item.name}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, display: { xs: 'none', sm: 'none', md: "flex" } }}>
                {authenticated ? (<Typography color="#fff" marginRight={2}>Hello, {getUserName()}</Typography>) : ("")}<AccountCircle sx={{ color: '#fff' }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {authenticated ? (
                <MenuItem onClick={() => handleNavigate("/profile")}>
                  <Button color="inherit">
                    Profile
                  </Button>
                </MenuItem>
              ) : (
                null
              )}
              <MenuItem onClick={handleCloseUserMenu}>
                {authenticated ? (
                  <Button color="inherit" onClick={handleLogout}>
                    Sign Out
                  </Button>
                ) : (
                  <Button color="inherit" onClick={handleLogin}>
                    Sign In / Sign Up
                  </Button>
                )}
              </MenuItem>
            </Menu>
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </StyledToolbar>
      </AppBar>
      <nav>
        <Drawer
          anchor="right"
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default Navbar;
