import { Grid } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";

export default function HomeLayout() {
  return (
    <Grid templateRows="auto 1fr" bg="background">
      <Navbar />
      <Outlet />
    </Grid>
  );
}
