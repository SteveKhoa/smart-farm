import React from 'react';
import { useSelector } from 'react-redux';
import AdminIotDashboard from "./AdminIoTDashboard";
import StudentIotDashboard from "./StudentIoTDashboard";

// Define the selector directly here or import if defined elsewhere
const selectUserRole = state => state.user.role;

const IoTDashboard = () => {
    const userRole = useSelector(selectUserRole);

    // Conditional rendering based on the user's role
    switch (userRole) {
        case 'admin':
            return <AdminIotDashboard />;
        case 'student':
            return <StudentIotDashboard />;
        default:
            return <div>Unauthorized access or role not defined</div>;
    }
};

export default IoTDashboard;
