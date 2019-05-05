// @material-ui/icons
import Code from "@material-ui/icons/Code";
import Dashboard from "@material-ui/icons/Dashboard";
import DockerBoat from "@material-ui/icons/DirectionsBoat";

import DockerLogo from './assets/img/docker.svg';

// core components/views for Admin layout
import DockerForm from "./views/DockerForm/DockerForm.jsx";
import DashboardPage from "./views/Dashboard/Dashboard.jsx";
import DockerCompose from "./views/DockerCompose/DockerCompose.jsx";

const dashboardRoutes = [
  {
    path: "/docker-form",
    name: "Code Compatibility",
    icon: Code,
    component: DockerForm,
    layout: "/admin"
  },
  {
    path: "/docker-compose",
    name: "Docker Compose",
    icon: DockerBoat,
    component: DockerCompose,
    layout: "/admin"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
];

export default dashboardRoutes;
