import PageLayout from "layouts/PageLayout";
import DeviceList from "./components/DeviceList";
import GeneralPanel from "./components/GeneralPanel.jsx";
import FeedbackButton from "./components/Feedback";
import { Box } from "@mui/joy";

const StudentIotDashboard = () => {
    return (
        console.log("StudentIotDashboard"),
        (
            <PageLayout focusOnRouteID={"iotdashboard"}>
                <Box>
                    <GeneralPanel />
                    <FeedbackButton />
                </Box>
                <DeviceList type="Device" />
                <DeviceList type="Sensor" />
            </PageLayout>
        )
    );
};

export default StudentIotDashboard;
