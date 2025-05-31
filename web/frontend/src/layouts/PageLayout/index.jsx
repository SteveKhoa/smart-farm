/**
 * General layout for any page (except login/logout) of the application.
 *
 * This layout is used in specific pages such as IoTDashboard, etc.
 */
import { Grid, Stack } from "@mui/joy";
import AppBreadcrumb from "components/AppBreadcrumb";

import SideNav from "components/SideNav";

const PageLayout = ({ focusOnRouteID, children }) => {
   

    return (
        <Grid container direction="row" spacing={3} sx={{ flexGrow: 1 }}>
            <Grid xs={2} sx={{ mr: 3 }}>
                <SideNav focusOnRouteID={focusOnRouteID} />
            </Grid>

            <Grid xs={9} direction="column" sx={{ flexGrow: 1, p: 3 }}>
                {/* <AppBreadcrumb /> */}

                <Stack
                    spacing={6}
                    direction="column"
                    flexWrap="nowrap"
                    sx={{ px: 1, pt: 3 }}
                >
                    {children}
                </Stack>
            </Grid>
        </Grid>
    );
};

export default PageLayout;

