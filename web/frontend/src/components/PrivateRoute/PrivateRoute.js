import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const authToken = localStorage.getItem("authToken"); // Hoặc phương thức xác thực khác

    return authToken ? children : <Navigate to="/portal" />;
};
export default PrivateRoute;