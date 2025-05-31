import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    Stack,
    Typography,
    Box,
    IconButton,
    Chip,
} from "@mui/joy";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import "chart.js";
import axios from "axios";

const DeviceSurface = ({ id, deviceID, name, type, position,schedule }) => {
    const [deviceOn, setDeviceOn] = useState(true);
    const [logData, setLogData] = useState([]);
    const [filterFromDateValue, setFilterFromDateValue] = useState("");
    const [filterToDateValue, setFilterToDateValue] = useState("");
    const [validDateRange, setValidDateRange] = useState(true);
    const [fetchLimit, setFetchLimit] = useState(10);
    const ADAFRUIT_IO_USERNAME = "1zy";
    const ADAFRUIT_IO_KEY = "aio_HQHl865UcZU9BnFNjemUKCfwh7Vx";

    useEffect(() => {
        const fetchLogData = async () => {
            const start_time = filterFromDateValue;
            const end_time = filterToDateValue;

            if (
                start_time == "" ||
                end_time == "" ||
                new Date(start_time) < new Date(end_time)
            ) {
                setValidDateRange(true);

                const response = await fetch(
                    `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${deviceID}/data?start_time=${start_time}&end_time=${end_time}&limit=${fetchLimit}`,
                    {
                        headers: {
                            "X-AIO-Key": ADAFRUIT_IO_KEY,
                        },
                    }
                );
                const data = await response.json();
                setLogData(data);
            } else {
                setValidDateRange(false);
            }
        };

        fetchLogData();
    }, [name, filterFromDateValue, filterToDateValue, fetchLimit]);

    {
        /* Reverse the list because AdaFruit returns time stamps from oldest to newest */
    }
    const data = {
        labels: logData
            .reverse()
            .map((log) => new Date(log.created_at).toLocaleTimeString()),
        datasets: [
            {
                label: "Value",
                data: logData.reverse().map((log) => log.value),
                fill: "start",
                borderColor: "rgb(75, 192, 192)",
                tension: 0.4,
            },
        ],
    };
    const toggleDeviceState = async () => {
        try {
            const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${deviceID}/data`;
            let response = await axios.get(url + "/last", {
                headers: { "X-AIO-Key": ADAFRUIT_IO_KEY },
            });

            let newValue;
            if (deviceID.toLowerCase() === "fan" ) {
                // For fan, either set to '50' or '0' based on current state
                newValue = {
                    value: parseFloat(response.data.value) !== 50 ? "50" : "0",
                };
            }
            else if  (deviceID.toLowerCase() === "led") {
                // For fan, either set to '50' or '0' based on current state
                newValue = {
                    value: parseFloat(response.data.value) !== 100 ? "100" : "0",
                };}
                 else {
                // For other devices, toggle between '0' and '1'
                newValue = {
                    value: parseFloat(response.data.value) === 0 ? "1" : "0",
                };
            }

            response = await axios.post(url, newValue, {
                headers: {
                    "Content-Type": "application/json",
                    "X-AIO-Key": ADAFRUIT_IO_KEY,
                },
            });
            setDeviceOn(newValue.value !== "0");
        } catch (error) {
            console.error(error);
            alert("Unable to toggle device state");
        }
    };

    return (
        <Card
            size="lg"
            color={deviceOn ? "primary" : "success"}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: deviceOn ? "" : "warning.outlinedActiveBg",
            }}
        >
            <Stack direction="column" spacing={4}>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                    justifyContent="space-between"
                >
                    <Box maxWidth={300}>
                        <Typography
                            level="h3"
                            endDecorator={
                                <Chip color="success" variant="soft">
                                    {type}
                                </Chip>
                            }
                            noWrap
                        >
                            {name}
                        </Typography>
                        <Typography
                            level="body-sm"
                            startDecorator={<LocationOnIcon />}
                            noWrap
                        >
                            {position}
                        </Typography>
                    </Box>
                    <IconButton
                        size="lg"
                        variant="solid"
                        color={deviceOn ? "success" : "danger"}
                        onClick={toggleDeviceState}
                    >
                        <PowerSettingsNewIcon />
                    </IconButton>
                </Stack>
                <Stack direction="column">
                {schedule && schedule.entries && (
                    <Stack direction="column">
                        <Typography
                            startDecorator={<EventIcon />}
                            level="title-sm"
                        >
                            Schedule
                        </Typography>
                        {schedule.entries.map((entry, index) => (
                            <Typography key={index} level="body-sm" color="success">
                                {entry.time} - {entry.action}
                            </Typography>
                        ))}
                    </Stack>
                )}
                </Stack>
            </Stack>
        </Card>
    );
};

export default DeviceSurface;
