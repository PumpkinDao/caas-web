import React from "react";
import { CssBaseline, Typography } from "@material-ui/core";
import Detail from "./mvp/detail";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./mvp/dashboard";
import { Center } from "./components/basic";

const P404 = () => (
  <Center style={{ paddingTop: "10rem" }}>
    <Typography variant={"h2"}>404 NOT FOUND</Typography>
  </Center>
);

const App = () => {
  return (
    <>
      <CssBaseline />
      <BrowserRouter basename={"/caas-web"}>
        <Routes>
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"/detail/:id"} element={<Detail />} />
          <Route path={"*"} element={<P404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
