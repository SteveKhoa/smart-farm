import PageLayout from "layouts/PageLayout";
import { Card, Stack, Grid } from "@mui/joy";

import UserList from "./components/UserList";
import UserSearch from "./components/UserSearch";
import UserDashboard from "./components/UserDashboard"

const AdminDashboard = () => {
    return (
        <PageLayout focusOnRouteID={"admindashboard"}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid xs={9}>
                    <Stack direction="column" spacing={2}>
                        <UserList />
                    </Stack>
                </Grid>
                <Grid xs={3}>
                    <UserDashboard />
                </Grid>
            </Grid>
        </PageLayout>
    );
};

export default AdminDashboard;
