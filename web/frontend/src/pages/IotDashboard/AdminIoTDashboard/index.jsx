import PageLayout from "layouts/PageLayout";
import DeviceList from "./components/DeviceList";

const AdminIotDashboard = () => {
    return (
        console.log("StudentIotDashboard"),
        (
            <PageLayout focusOnRouteID={"iotdashboard"}>
                <DeviceList type="Device" />
                <DeviceList type="Sensor" />
            </PageLayout>
        )
    );
};

export default AdminIotDashboard;
