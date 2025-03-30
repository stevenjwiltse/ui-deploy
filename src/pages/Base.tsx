import { Box } from "@mui/material";
import { ReactNode } from "react";
import Navbar, { NavItemsType } from "../components/Navbar";
import Footer from "../components/Footer";
import { useKeycloak } from "../hooks/useKeycloak";

type BaseProps = {
  children: ReactNode;
};

export default function Base({ children }: BaseProps) {
  const { keycloak, authenticated } = useKeycloak();
  const navItems: NavItemsType[] = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About Us",
      link:
        "/about",
    },
    {
      name: "Services",
      link: "/services",
    },
  ];
  const authenticatedNavItems: NavItemsType[] = [
    {
      name: "Schedules",
      link: "/schedules",
    },
  ];
  if (authenticated) {
    navItems.push(...authenticatedNavItems);
  }
  return (
    <Box>
      <Navbar navItems={navItems} />
      <Box>
        {children}
      </Box>
      <Footer />
    </Box>
  )
}