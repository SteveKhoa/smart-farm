import PageLayout from "layouts/PageLayout";
import { Typography, Grid, Stack, Card, Box } from "@mui/joy";
import DataActions from "./components/DataActions";

import KPI from "./components/KPI";
import AnomalyTracker from "./components/AnomalyTracker";
import TrendAnalysis from "./components/TrendAnalysis";

const AdminDataDashboard = () => {
    return (
        <PageLayout focusOnRouteID={"datadashboard"}>
            <KPI />
            <TrendAnalysis />
        </PageLayout>
    );
};

export default AdminDataDashboard;
