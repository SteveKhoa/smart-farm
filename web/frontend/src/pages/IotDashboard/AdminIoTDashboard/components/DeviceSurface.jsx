import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    Stack,
    Typography,
    Box,
    IconButton,
    Chip,
    Tooltip,
    Dropdown,
    MenuButton,
    MenuItem,
    Menu,
    Input,
    FormLabel,
    FormControl,
    Slider,
} from "@mui/joy";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import EventIcon from "@mui/icons-material/Event";
import { Line } from "react-chartjs-2";
import "chart.js";
import {
    FileDownload,
    FilterAlt,
    DataObject,
    Subject,
} from "@mui/icons-material";

import exportJSON from "utils/exportJSON";
import exportCSV from "utils/exportCSV";
import axios from "axios";

import DeviceSettingsModalContext from "../contexts/DeviceSettings";

const DeviceSurface = ({ id, deviceID, name, type, position }) => {
    const [deviceOn, setDeviceOn] = useState(true);
    const setOpenDetailModal = useContext(DeviceSettingsModalContext);
    const [logData, setLogData] = useState([]);
    const [filterFromDateValue, setFilterFromDateValue] = useState("");
    const [filterToDateValue, setFilterToDateValue] = useState("");
    const [validDateRange, setValidDateRange] = useState(true);
    const [fetchLimit, setFetchLimit] = useState(10);
    const ADAFRUIT_IO_USERNAME = "";
    const ADAFRUIT_IO_KEY = "";

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
        labels: logData.reverse().map((log) => {
            const date = new Date(log.created_at);

            const hour = date.getHours();
            const minute = date.getMinutes();

            return `${hour}:${minute}, ${date.getUTCDate()}/${date.getUTCMonth()} `
        }),
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
                minWidth: 400,
                minHeight: 300,
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
                    <IconButton
                        size="lg"
                        variant="solid"
                        color={deviceOn ? "success" : "danger"}
                        onClick={toggleDeviceState}
                    >
                        <PowerSettingsNewIcon />
                    </IconButton>
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
                        color="primary"
                        disabled={!deviceOn}
                        onClick={() => setOpenDetailModal({ deviceID: id })}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Stack>
                <Stack direction="column">
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-end"
                    >
                        <Stack direction="row">
                            {/* This block is for Date Range Filter logic */}
                            <Dropdown>
                                <Tooltip title="Filter">
                                    <MenuButton slots={{ root: IconButton }}>
                                        <FilterAlt />
                                    </MenuButton>
                                </Tooltip>
                                <Menu>
                                    <Box sx={{ m: 2 }}>
                                        <Stack direction="column" spacing={2}>
                                            <Typography level="title-sm">
                                                <Typography
                                                    variant="outlined"
                                                    color="success"
                                                >
                                                    Filter
                                                </Typography>{" "}
                                                by date range
                                            </Typography>

                                            {!validDateRange ? (
                                                <Typography
                                                    color="danger"
                                                    level="body-sm"
                                                >
                                                    Invalid date range. Please
                                                    try again.
                                                </Typography>
                                            ) : (
                                                <></>
                                            )}

                                            <Stack direction="row" spacing={1}>
                                                <Stack
                                                    direction="column"
                                                    spacing={0}
                                                >
                                                    <Typography level="body-sx">
                                                        From...
                                                    </Typography>
                                                    <Input
                                                        type="date"
                                                        value={
                                                            filterFromDateValue
                                                                ? new Date(
                                                                      filterFromDateValue
                                                                  )
                                                                      .toISOString()
                                                                      .slice(
                                                                          0,
                                                                          10
                                                                      )
                                                                : ""
                                                        }
                                                        onChange={(e) => {
                                                            setFilterFromDateValue(
                                                                new Date(
                                                                    e.target.value
                                                                ).toISOString()
                                                            );
                                                        }}
                                                    />
                                                </Stack>
                                                <Stack
                                                    direction="column"
                                                    spacing={0}
                                                >
                                                    <Typography level="body-sx">
                                                        To...
                                                    </Typography>
                                                    <Input
                                                        type="date"
                                                        value={
                                                            filterToDateValue
                                                                ? new Date(
                                                                      filterToDateValue
                                                                  )
                                                                      .toISOString()
                                                                      .slice(
                                                                          0,
                                                                          10
                                                                      )
                                                                : ""
                                                        }
                                                        onChange={(e) => {
                                                            setFilterToDateValue(
                                                                new Date(
                                                                    e.target.value
                                                                ).toISOString()
                                                            );
                                                        }}
                                                    />
                                                </Stack>
                                            </Stack>

                                            <Stack>
                                                <Typography level="body-sx">
                                                    Limit of data points
                                                </Typography>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    spacing={2}
                                                >
                                                    <Typography level="body-sx">
                                                        10
                                                    </Typography>
                                                    <Slider
                                                        defaultValue={
                                                            fetchLimit
                                                        }
                                                        step={1}
                                                        marks
                                                        min={10}
                                                        max={30}
                                                        valueLabelDisplay="auto"
                                                        onChange={(e) =>
                                                            setFetchLimit(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <Typography level="body-sx">
                                                        30
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Menu>
                            </Dropdown>
                            <Dropdown>
                                {/* Download (Export) from the frontend */}
                                <Tooltip title="Export">
                                    <MenuButton slots={{ root: IconButton }}>
                                        <FileDownload />
                                    </MenuButton>
                                </Tooltip>
                                <Menu>
                                    <MenuItem
                                        onClick={() => exportCSV(logData)}
                                    >
                                        Export as CSV <Subject />
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => exportJSON(logData)}
                                    >
                                        Export as JSON <DataObject />
                                    </MenuItem>
                                </Menu>
                            </Dropdown>
                        </Stack>
                    </Stack>
                    <Card variant="soft" color="white">
                        <Stack direction="column">
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {/* Graph */}
                                <Line data={data} />
                            </Stack>
                            {filterFromDateValue != "" &&
                            filterToDateValue != "" ? (
                                <Typography textAlign="center">
                                    {new Date(
                                        filterFromDateValue
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                        filterToDateValue
                                    ).toLocaleDateString()}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </Stack>
                    </Card>
                </Stack>
            </Stack>
        </Card>
    );
};

export default DeviceSurface;
