import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

const theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            main: "#ff0000",
        },
        secondary: {
            main: "#00ff00",
        },
        error: {
            main: red.A400,
        }
    },
})

export default theme;