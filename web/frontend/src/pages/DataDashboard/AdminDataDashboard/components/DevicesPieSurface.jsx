import React, { useState, useEffect } from "react";
import {
    Card,
    Stack,
    Typography,
    Box,
    IconButton,
    Tooltip,
    Dropdown,
    MenuButton,
    Menu,
    MenuItem,
} from "@mui/joy";
import axios from "axios";
import { Subject, DataObject, FileDownload } from "@mui/icons-material";
import { Doughnut } from "react-chartjs-2";
import exportCSV from "utils/exportCSV";
import exportJSON from "utils/exportJSON";
import "chartjs-plugin-datalabels";
import "chart.js/auto";

const DevicesPieSurface = () => {
    const [logData, setLogData] = useState([]);
    const [deviceChartData, setDeviceChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Device Types",
                data: [],
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                ],
                hoverOffset: 4,
            },
        ],
    });
    const [sensorChartData, setSensorChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Sensor Types",
                data: [],

                backgroundColor: [
                    "rgb(75, 192, 192)",
                    "rgb(153, 102, 255)",
                    "rgb(255, 159, 64)",
                ],
                hoverOffset: 4,
            },
        ],
    });
    const chartOptions = {
        plugins: {
            datalabels: {
                display: true,
                color: "white",
                formatter: (value, context) => {
                    // Hiển thị giá trị trực tiếp trên chart
                    return (
                        context.chart.data.labels[context.dataIndex] +
                        `\n (${value})`
                    );
                },
            },
        },
    };
    const authToken = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchAllDevices = async () => {
            if (authToken) {
                try {
                    const response = await axios.get(
                        "http://localhost:3000/api/device/",
                        {
                            headers: { Authorization: `Bearer ${authToken}` },
                        }
                    );
                    const devices = response.data.device || [];
                    setLogData(devices);
                } catch (error) {
                    console.error("Failed to fetch device data:", error);
                }
            }
        };
        fetchAllDevices();
    }, [authToken]);

    useEffect(() => {
        if (logData.length > 0) {
            const deviceData = logData.filter(
                (device) => device.type === "Device"
            );
            const sensorData = logData.filter(
                (device) => device.type === "Sensor"
            );

            const deviceCounts = deviceData.reduce((acc, device) => {
                acc[device.name] = (acc[device.name] || 0) + 1;
                return acc;
            }, {});

            const sensorCounts = sensorData.reduce((acc, sensor) => {
                acc[sensor.name] = (acc[sensor.name] || 0) + 1;
                return acc;
            }, {});

            setDeviceChartData({
                labels: Object.keys(deviceCounts),
                datasets: [
                    {
                        label: "Device Types",
                        data: Object.values(deviceCounts),
                        backgroundColor: [
                            "rgb(255, 99, 132)",
                            "rgb(54, 162, 235)",
                            "rgb(255, 205, 86)",
                        ],
                        hoverOffset: 4,
                    },
                ],
            });

            setSensorChartData({
                labels: Object.keys(sensorCounts),
                datasets: [
                    {
                        label: "Sensor Types",
                        data: Object.values(sensorCounts),
                        backgroundColor: [
                            "rgb(75, 192, 192)",
                            "rgb(153, 102, 255)",
                            "rgb(255, 159, 64)",
                        ],
                        hoverOffset: 4,
                    },
                ],
            });
        }
    }, [logData]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
            }}
        >
            {/* Card cho Device Types */}
            <Card
                size="lg"
                color="primary"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 2,
                    }}
                >
                    <Typography level="h3" noWrap>
                        Device Types
                    </Typography>
                    <Tooltip title="Export">
                        <IconButton
                            onClick={() =>
                                exportCSV(
                                    logData.filter(
                                        (device) => device.type === "Device"
                                    ),
                                    "Device_data.csv"
                                )
                            }
                        >
                            <FileDownload />
                        </IconButton>
                        {/* <IconButton onClick={() => exportJSON(logData.filter(device => device.type === "Device"),"Device_data.json")}>
                            <FileDownload />
                        </IconButton> */}
                    </Tooltip>
                </Box>
                {deviceChartData.datasets[0].data.length > 0 && (
                    <Doughnut data={deviceChartData} />
                )}
            </Card>

            {/* Card cho Sensor Types */}
            <Card
                size="lg"
                color="primary"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 2,
                    }}
                >
                    <Typography level="h3" noWrap>
                        Sensor Types
                    </Typography>
                    <Tooltip title="Export">
                        <IconButton
                            onClick={() =>
                                exportCSV(
                                    logData.filter(
                                        (device) => device.type === "Sensor"
                                    ),
                                    "Sensor_data.csv"
                                )
                            }
                        >
                            <FileDownload />
                        </IconButton>
                        {/* <IconButton onClick={() => exportJSON(logData.filter(device => device.type === "Sensor"),"Sensor_data.json")}>
                            <FileDownload />
                        </IconButton> */}
                    </Tooltip>
                </Box>
                {sensorChartData.datasets[0].data.length > 0 && (
                    <Doughnut data={sensorChartData} />
                )}
            </Card>
        </Box>
    );
};

export default DevicesPieSurface;
