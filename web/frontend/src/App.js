import { BrowserRouter, Routes, Route } from "react-router-dom";

import DataDashboard from "pages/DataDashboard";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<DataDashboard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
