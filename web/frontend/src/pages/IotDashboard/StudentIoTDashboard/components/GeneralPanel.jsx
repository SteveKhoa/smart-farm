import { Box, Card, Chip, Stack, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import axios from "axios";
import EventIcon from '@mui/icons-material/Event';
import { Event } from "@mui/icons-material";

const ClockCard = () => {
    const Realtime = () => {
        const getCurrentTime = () => {
            const dateObject = new Date();

            const hour = String(dateObject.getHours()).padStart(2, "0");
            const minute = String(dateObject.getMinutes()).padStart(2, "0");
            const second = String(dateObject.getSeconds()).padStart(2, "0");

            const currentTime = hour + ":" + minute + ":" + second;
            return currentTime;
        };

        const [time, setTime] = useState(getCurrentTime());
        useEffect(() => {
            // https://stackoverflow.com/questions/70734401/creating-clock-in-react
            setInterval(() => {
                const currentTime = getCurrentTime();
                setTime(currentTime);
            }, 1000);
        }, []);

        return <span>{time}</span>;
    };

    const getCurrentDate = () => {
        const dateObject = new Date();
        const currentDate = dateObject.toDateString();

        return currentDate;
    };

    return (
        <Stack direction="column" spacing={2}>
            <Stack direction="column" spacing={0}>
                <Typography level="body-sm">(GMT+7)</Typography>
                <Typography level="h1">
                    <Realtime />
                </Typography>
            </Stack>
            <Typography level="body-lg">{getCurrentDate()}</Typography>
        </Stack>
    );
};

const InfoCard = ({ schedule }) => {
    const today = new Date().getDay();  // JavaScript's getDay() returns 0 for Sunday to 6 for Saturday
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todaySchedule = schedule && schedule[weekdays[today]];  // Access schedule for today
    const nextDaySchedule = schedule && schedule[weekdays[(today + 1) % 7]];  // Access schedule for next day
    console.log(todaySchedule);

    return (
        <Stack direction="row">
            <Stack direction="column" spacing={4}>
                <Typography level="title-lg">Student</Typography>
                <Stack direction="row" spacing={4}>
                    {todaySchedule && todaySchedule.length > 0 && (
                        <Stack direction="column">
                            <Typography startDecorator={<EventIcon />}>
                                Current schedule
                            </Typography>
                            {todaySchedule.map((entry, index) => (
                                <Typography
                                    key={index}
                                    startDecorator={
                                        <Chip variant="soft" color="success">
                                            {entry.location}
                                        </Chip>
                                    }
                                    color="success"
                                >
                                    {entry.time} - {entry.activity}, Today
                                </Typography>
                            ))}
                        </Stack>
                    )}
                    {nextDaySchedule && nextDaySchedule.length > 0 && (
                        <Stack direction="column">
                            <Typography startDecorator={<EventIcon />}>
                                Next schedule
                            </Typography>
                            {nextDaySchedule.map((entry, index) => (
                                <Typography
                                    key={index}
                                    startDecorator={<Chip variant="soft">{entry.location}</Chip>}
                                >
                                    {entry.time} - {entry.activity}, Tomorrow
                                </Typography>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
};



const GeneralPanel = () => {
    const [userData, setUserData] = useState(null);
    const authToken = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!authToken) return;  // Ensure there is a token
            try {
                const response = await axios.get("http://localhost:3000/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, [authToken]);

    return (
        <Box>
            <Card>
                <Stack direction="row" justifyContent="space-between">
                    <ClockCard />
                    {userData && <InfoCard schedule={userData.schedule} />}
                </Stack>
            </Card>
        </Box>
    );
};

export default GeneralPanel;


