import { Typography, Grid, Stack, Card, Box } from "@mui/joy";

import TimerIcon from "@mui/icons-material/Timer";
import { Line, Bar, Pie, Radar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const CostTrend = () => {
    const data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label: "$",
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(201, 203, 207, 0.2)",
                ],
                borderColor: [
                    "rgb(255, 99, 132)",
                    "rgb(255, 159, 64)",
                    "rgb(255, 205, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(54, 162, 235)",
                    "rgb(153, 102, 255)",
                    "rgb(201, 203, 207)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Card>
            <Stack direction="column" spacing={1}>
                <Typography level="title-lg">Monthly Cost Trends</Typography>
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Line data={data}></Line>
                </Stack>
            </Stack>
        </Card>
    );
};

const AnomalyTracker = () => {
    return (
        <Stack direction="column" spacing={2}>
            <Typography color="neutral" endDecorator={<TimerIcon />}>
                Anomaly Tracking
            </Typography>
            <CostTrend />
        </Stack>
    );
};

export default AnomalyTracker;
