// @material-ui/icons
import Code from "@material-ui/icons/Code";
import Dashboard from "@material-ui/icons/Dashboard";
// core components/views for Admin layout
import DockerForm from "./views/DockerForm/DockerForm.jsx";
import DashboardPage from "./views/Dashboard/Dashboard.jsx";

const dashboardRoutes = [
  {
    path: "/docker-form",
    name: "Code Compatibility",
    icon: Code,
    component: DockerForm,
    layout: "/admin"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
];

export default dashboardRoutes;
