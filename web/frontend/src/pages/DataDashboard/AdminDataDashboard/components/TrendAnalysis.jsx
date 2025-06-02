import {
    Typography,
    Grid,
    Stack,
    Card,
    Box,
    Tooltip,
    IconButton,
    Input,
} from "@mui/joy";

import {
    QueryStats,
    ArrowUpward,
    Subject,
    DataObject,
} from "@mui/icons-material";
import { Line, Bar, Pie, Radar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import { useEffect, useState } from "react";

const EnergyConsumptionPerDevice = () => {
    const [fromDate, setFromDate] = useState("2024-05-31");
    const [toDate, setToDate] = useState("2025-06-03");
    const [graphData, setGraphData] = useState({ datasets: [] });

    const [increasedDevices, setIncreasedDevices] = useState([]);
    const [decreasedDevice, setDecreasedDevice] = useState([]);
    const [peakDevice, setPeakDevice] = useState({});

    const loadsFigures = async () => {
        const response = await axios.get("http://localhost:3000/api/device/");
        // Just keep fan and led2
        const devices = response.data.device.filter((x) => x.deviceID == "fan");

        const datas = await Promise.all(
            devices.map(async (device) => {
                const response = await fetch(
                    `https://app.coreiot.io/api/plugins/telemetry/DEVICE/1bbc3690-3864-11f0-aae0-0f85903b3644/values/timeseries?keys=value&startTs=${
                        (new Date(fromDate)).getTime()
                    }&endTs=${(new Date(toDate)).getTime()}`,
                    {
                        headers: {
                            "X-Authorization":
                                "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsZXZpZXR0dW5nbHRAZ21haWwuY29tIiwidXNlcklkIjoiZGI4MDM3NjAtMjljMy0xMWYwLWEzYzktYWIwZDg5OTlmNTYxIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiIxNzMxZWM2YS0wNGEyLTRmMGMtYjE1Ny03NGQwOWQ5NzBjNTUiLCJleHAiOjE3NDg4NTIyNjksImlzcyI6ImNvcmVpb3QuaW8iLCJpYXQiOjE3NDg4NDMyNjksImZpcnN0TmFtZSI6InTDuW5nIiwibGFzdE5hbWUiOiJsw6oiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiZGI2ZTM2MDAtMjljMy0xMWYwLWEzYzktYWIwZDg5OTlmNTYxIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9._uTo6jmqMPeUxfr5xGsljUnrJ9tm9c9HcLVcY0xz-VbdmkJy5ZwF51ZechGrKh4cebVX1a6h-63m3ukyObXRBw",
                        },
                    }
                );

                const json_response = await response.json();

                let data = {
                    label: device.name,
                    data: [],
                    borderWidth: 5,
                };

                const dates_values = json_response.value.map(
                    (date_value_pair) => {
                        const date = new Date(date_value_pair.ts);
                        const value = date_value_pair.value;

                        data.data.push({
                            x: date.toLocaleDateString(),
                            y: (value * device.c_num) / 1000,
                        });

                        return { date: date, value: value };
                    }
                );

                const maxValue = Math.max(...dates_values.map((a) => a.value));
                const maxDate = dates_values.find(
                    (e) => e.value == maxValue
                ).date;

                // LAM TOI DAY SAO MA ADAFRUIT BI DUNG HINH LUON ROI

                return data;
            })
        );

        setGraphData({
            datasets: datas,
        });

        setPeakDevice({
            name: "Quạt",
            date: new Date("5/5/2024").toLocaleDateString(),
            value: 5.25,
        });

        console.log(datas);

        const increases = datas.map((data) => {
            const values = data.data.map((x) => x.y);
            const delta =
                1.0 -
                (Math.max(...values) - Math.min(...values)) /
                    (Math.max(...values) + Math.min(...values));

            return { name: data.label, delta: delta };
        });

        console.log(increases);

        setIncreasedDevices(increases);
        setDecreasedDevice([]);
    };

    useEffect(() => {
        loadsFigures();
    }, [fromDate, toDate]);

    return (
        <Card>
            <Stack direction="column">
                <Typography color="neutral">
                    Energy consumption trends
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Grid xs={8}>
                        <Line data={graphData} />
                        <Stack direction="row" justifyContent="space-between">
                            <Stack direction="row">
                                <Tooltip title="Export as CSV">
                                    <IconButton>
                                        <Subject />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Export as JSON">
                                    <IconButton>
                                        <DataObject />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <Input
                                    type="date"
                                    onChange={(e) => {
                                        setFromDate(e.target.value);
                                    }}
                                />
                                <Typography> to </Typography>
                                <Input
                                    type="date"
                                    onChange={(e) => {
                                        setToDate(e.target.value);
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid xs={4}>
                        <Stack direction="column" spacing={2}>
                            <Typography level="title-lg">Analytics</Typography>
                            <Stack direction="column">
                                <Typography level="title-sm">
                                    Increased consumption last 28 days
                                </Typography>
                                <Stack direction="column" spacing={1}>
                                    {increasedDevices.length > 0 ? (
                                        increasedDevices.map(
                                            (increase, idx) => (
                                                <Typography
                                                    key={idx}
                                                    variant="soft"
                                                    color="danger"
                                                >
                                                    {increase.name} (+
                                                    {(
                                                        increase.delta * 100
                                                    ).toFixed(2)}
                                                    %)
                                                </Typography>
                                            )
                                        )
                                    ) : (
                                        <Typography
                                            variant="soft"
                                            color="danger"
                                        >
                                            None
                                        </Typography>
                                    )}
                                </Stack>
                            </Stack>
                            <Stack direction="column">
                                <Typography level="title-sm">
                                    Decreased consumption last 28 days
                                </Typography>
                                <Stack direction="column" spacing={1}>
                                    {decreasedDevice.length > 0 ? (
                                        decreasedDevice.map((decrease, idx) => (
                                            <Typography
                                                variant="soft"
                                                color="danger"
                                            >
                                                {decrease.name} (+
                                                {(decrease.delta * 100).toFixed(
                                                    2
                                                )}
                                                %)
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography
                                            variant="soft"
                                            color="success"
                                        >
                                            None
                                        </Typography>
                                    )}
                                </Stack>
                            </Stack>
                            <Stack direction="column">
                                <Typography level="title-sm">
                                    Peak consumption last 28 days
                                </Typography>
                                <Stack direction="column">
                                    <Typography variant="soft" color="danger">
                                        {peakDevice.name} ({peakDevice.value}{" "}
                                        kWh) on {peakDevice.date}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                </Stack>
            </Stack>
        </Card>
    );
};

const TrendAnalysis = () => {
    return (
        <Stack direction="column" spacing={2}>
            <Typography color="neutral" endDecorator={<QueryStats />}>
                Trend Analysis
            </Typography>
            <EnergyConsumptionPerDevice />
        </Stack>
    );
};

export default TrendAnalysis;
