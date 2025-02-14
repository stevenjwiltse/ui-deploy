import React from "react"
import "./App.css"
import { Container } from "@mui/material"
import AppAppBar from "./components/NavigationBar"


function App() {
  return (
    <Container maxWidth="sm">
      <AppAppBar />
    </Container>
    // <>
    //   <h1>Barber Shop UI</h1>
    //   <div className="card">
    //     <p>
    //       <code>Hello World!</code>
    //     </p>
    //     <Button variant="outlined" color="primary">
    //         Click me
    //     </Button>
    //   </div>
    // </>
  )
}

export default App
