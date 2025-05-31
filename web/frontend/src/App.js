import { BrowserRouter, Routes, Route } from "react-router-dom";

import IotDashboard from "pages/IotDashboard";
import Login from "pages/Login";
import PrivateRoute from "components/PrivateRoute/PrivateRoute.js";
import DataDashboard from "pages/DataDashboard";
import AdminDashboard from "pages/AdminDashboard";

import routes from "appRoutes";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Root, for now set to Login page */}
                <Route index element={<Login />} />

                {/* Special pages not listed in SideNave */}
                <Route path="/portal" element={<Login />} />

                {/* Special pages LISTED in SideNave */}
                <Route path={routes[0].route} element={ <PrivateRoute>
                    <DataDashboard />
                  </PrivateRoute>} />
                <Route path={routes[1].route} element={ <PrivateRoute>
                    <IotDashboard />
                </PrivateRoute>} />
                <Route path={routes[2].route} element={ <PrivateRoute>
                    <AdminDashboard />
                </PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
