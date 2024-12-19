import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../constants";
import Dashboard from "./components/Dashboard";
import Gallery from "./components/Gallery";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Visualize from "./components/Visualize";
import DashLayout from "./layouts/DashLayout";
import HomeLayout from "./layouts/HomeLayout";

export default function Router() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
      </Route>
      <Route element={<DashLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.GALLERY} element={<Gallery />} />
        <Route path={`${ROUTES.VISSUALIZE}/:id`} element={<Visualize />} />
      </Route>
    </Routes>
  );
}
