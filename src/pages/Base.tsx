import { Box } from "@mui/material";
import { ReactNode } from "react";
import Navbar, { NavItemsType } from "../components/Navbar";
import Footer from "../components/Footer";

type BaseProps = {
  children: ReactNode;
};

const navItems: NavItemsType[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Services",
    link: "/services",
  },
  {
    name: "Barbers",
    link: "/barbers",
  },
]

export default function Base({ children }: BaseProps) {
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