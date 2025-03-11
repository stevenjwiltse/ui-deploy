import { Box } from "@mui/material";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type BaseProps = {
  children: ReactNode;
};

export default function Base({ children }: BaseProps) {
  return (
    <Box>
      <Navbar />
      <Box>
        {children}
      </Box>
      <Footer />
    </Box>
  )
}