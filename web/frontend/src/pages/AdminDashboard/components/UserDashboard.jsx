import {
    Stack,
    Card,
    Typography,
    Box,
    Modal,
    ModalDialog,
    ModalClose,
    Chip,
} from "@mui/joy";
import { Button, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { render } from "react-dom";
import ChartDataLabels from "chartjs-plugin-datalabels";

import React, { useEffect } from "react";
import axios from "axios";


const TotalUsers = () => {
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        // Function to fetch all users and count them
        const fetchAndCountUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user'); // Fetch all users from the API endpoint
                console.log(response)
                const usersList = response.data.user; // Extract the list of users from the response data
                const count = usersList.length; // Calculate the total number of users
                setTotalUsers(count); // Update the state with the total user count
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAndCountUsers(); // Call the function to fetch and count users
    }, []);

    return (
        <Card>
            <Stack direction="column" spacing={1}>
                <Typography level="title-lg">Total users</Typography>
                <Typography level="h1" textAlign="center">
                    {totalUsers}
                </Typography>
            </Stack>
        </Card>
    );
};


const UserRoles = () => {
    const [userRolesData, setUserRolesData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user/statistics/user-roles");
                const { labels, data } = response.data;
                setUserRolesData({
                    labels,
                    datasets: [
                        {
                            label: "Number of people",
                            data,
                            backgroundColor: ["#00B2BF", "#426EB4", "#67BF7F", "#635BA2"],
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching user roles data:", error);
            }
        };
        fetchUserRoles();
    }, []);

    const pieOptions = {
        plugins: {
            datalabels: {
                color: "white",
            },
        },
    };

    if (userRolesData.labels.length === 0) {
        return <Card>Loading...</Card>;
    }

    return (
        <Card>
            <Stack direction="column" spacing={1}>
                <Typography level="title-lg">User roles</Typography>
                <Pie data={userRolesData} options={pieOptions} plugins={[ChartDataLabels]} />
            </Stack>
        </Card>
    );
};

const LoginIntensity = () => {
    // State for the fetched data
    const [loginData, setLoginData] = useState({
        labels: [],
        datasets: [],
    });
    const [averagePerHour, setAveragePerHour] = useState(0);
    const [lastPeak, setLastPeak] = useState({ time: "", logins: 0 });

    const [open, setOpen] = useState(false);

    // Fetch data from backend
    useEffect(() => {
        // Fetch login attempts by hour data
        const fetchLoginData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stat/login-attempts-by-hour');
                const stats = response.data;

                const labels = stats.map(item => `${item._id}:00`);
                const data = stats.map(item => item.totalLogins);

                setLoginData({
                    labels,
                    datasets: [
                        {
                            label: "Number of logins",
                            data,
                            fill: false,
                            tension: 0.1,
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching login data:", error);
            }
        };

        // Fetch average logins per hour data
        const fetchAveragePerHour = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stat/average-logins-per-hour');
                const { average } = response.data;
                setAveragePerHour(average);
            } catch (error) {
                console.error("Error fetching average logins per hour:", error);
            }
        };

        // Fetch peak login time data
        const fetchPeakLoginTime = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stat/peak-login-time');
                const { peakTime, logins } = response.data;
                setLastPeak({ time: peakTime, logins });
            } catch (error) {
                console.error("Error fetching peak login time:", error);
            }
        };

        fetchLoginData();
        fetchAveragePerHour();
        fetchPeakLoginTime();
    }, []);

    // DetailModal component
    const DetailModal = ({ open, setOpen }) => (
        <Modal open={open}>
            <ModalDialog minWidth={500}>
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography level="title-lg">Daily login distribution</Typography>
                        <Button variant="plain" onClick={() => setOpen(false)}>Done</Button>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={1}>
                        <Bar data={loginData} />
                        <Typography level="body-lg">Average per hour: 
                            <Typography color="primary" variant="solid">{averagePerHour}</Typography>
                        </Typography>
                        <Typography level="body-lg">Last peak: 
                            <Typography color="primary" variant="solid">{lastPeak.logins}</Typography> at
                            <Chip color="primary">{lastPeak.time}</Chip>
                        </Typography>
                    </Stack>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );

    if (!loginData.labels.length) {
        return <Card>Loading...</Card>;
    }

    return (
        <Card>
            <Stack direction="column" spacing={1}>
                <Stack direction="column">
                    <Typography level="title-lg">Daily login distribution</Typography>
                    <Typography level="body-sm">*averaged weekly</Typography>
                </Stack>
                <Bar data={loginData} onClick={() => setOpen(true)} />
            </Stack>
            <DetailModal open={open} setOpen={setOpen} />
        </Card>
    );
};

//     return (
//         <Card>
//             <Stack direction="column" spacing={1}>
//                 <Stack direction="column">
//                     <Typography level="title-lg">
//                         Daily login distribution
//                     </Typography>
//                     <Typography level="body-sm">*averaged weekly</Typography>
//                 </Stack>
//                 <Bar onClick={() => setOpen(true)} data={fakeLoginData} />
//             </Stack>
//             <DetailModal open={open} setOpen={setOpen} />
//         </Card>
//     );
// };


const UserDashboard = () => {
    return (
        <Stack direction="column" spacing={2}>
            <TotalUsers />
            <UserRoles />
            <LoginIntensity />
        </Stack>
    );
};

export default UserDashboard;
