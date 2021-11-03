import React from "react";
import { AppBar, CssBaseline, Toolbar, Typography } from "@material-ui/core";
import Demo from "./demo";

const Header = () => (
  <AppBar color={"primary"} position={"relative"}>
    <Toolbar>
      <Typography variant={"h6"} color={"inherit"}>
        Web
      </Typography>
    </Toolbar>
  </AppBar>
);

const App = () => {
  return (
    <>
      <CssBaseline />
      <Header />
      <Demo />
    </>
  );
};

export default App;
