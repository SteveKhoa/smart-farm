/**
 * Define metadata for routes.
 *
 * Note: Do not implement `component` field since it will raise circular dependency.
 */

import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

const routes = [
    {
        name: "Cost Dashboard",
        key: "datadashboard",
        role: "",
        icon: <SpaceDashboardIcon />,
        route: "/data",
    },
];

export default routes;
