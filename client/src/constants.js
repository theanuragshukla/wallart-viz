import { Gallery, Home, Setting3 } from "iconsax-react";

export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  SIGNUP: "/signup",
  GALLERY: "/gallery",
  VISSUALIZE: "/visualize"
};

export const SIDEBAR_ROUTES = [
  {
    label: "Home",
    icon: Home,
    route: ROUTES.DASHBOARD,
  },
  {
    label: "Gallery",
    icon: Gallery,
    route: ROUTES.GALLERY,
  },
  {
    label: "Settings",
    icon: Setting3,
    route: ROUTES.DASHBOARD,
  },
];
