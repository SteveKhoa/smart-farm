import React, { useState, useEffect, useContext, useRef, useCallback, memo  } from 'react';
import axios from "axios";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import {
    Typography,
    Chip,
    IconButton,
    CircularProgress,
    Stack,
    Box,
    Grid,
    Card,
    Button,
    Dropdown,
    Select,
    Option,
    Input,
    Slider,
} from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar, Alert } from '@mui/material';

import DeviceSettingsModalContext from "../contexts/DeviceSettings";


const DialogHeader = ({ deviceDetail, onSave }) => {
    const setModalObject = useContext(DeviceSettingsModalContext);
    return (
        <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography level="h1" endDecorator={<IconButton color="neutral"><EditIcon /></IconButton>}>
                    {deviceDetail.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button startDecorator={<DoneIcon />} color="primary" size="sm" onClick={onSave}>
                        Apply
                    </Button>
                    <IconButton color="danger" size="sm" onClick={() => setModalObject({})}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip color="success" variant="soft">{deviceDetail.type}</Chip>
                    <Chip><Typography startDecorator={<LocationOnIcon />}>{deviceDetail.position}</Typography></Chip>
                </Stack>
            </Typography>
        </DialogTitle>
    );
};

const GeneralInfo = ({ deviceDetail }) => {
    return (
        <Stack direction="column">
            <Typography>
                Last Value: {deviceDetail.curValue.lastValue}
            </Typography>
            <Typography>
                Last Updated At:{" "}
                {new Date(deviceDetail.curValue.updatedAt).toLocaleString()}
            </Typography>
        </Stack>
    );
};

const SliderControl = ({ sliderValue, onSliderChange }) => {
    const ItensitySlider = ({ labelName, minValue, maxValue }) => {
        return (
            <Card>
                <Typography level="title-sm">{labelName}</Typography>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                    <Typography>{minValue}</Typography>
                    <Slider
                        value={sliderValue} // Use value from props
                        onChange={onSliderChange} // Use handler from props
                        valueLabelDisplay="on"
                        step={5}
                        marks
                        min={minValue}
                        max={maxValue}
                    />
                    <Typography>{maxValue}</Typography>
                </Stack>
            </Card>
        );
    };

    return (
        <Stack direction="column" spacing={1}>
            <Typography level="h3">Control</Typography>
            <Grid xs={5}>
                <ItensitySlider labelName="Intensity" minValue={0} maxValue={100}/>
            </Grid>
        </Stack>
    );
};






const ScheduleSection = () => {
    return (
        <Stack direction="column">
            <Typography level="h3">Schedule</Typography>
            <Card>
                <Stack direction="row" justifyContent="space-between">
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <Typography>Keep </Typography>
                        <Select
                            placeholder="Select an action"
                            name="foo"
                            required
                            sx={{ minWidth: 200 }}
                            defaultValue="a"
                            onChange={() => {}}
                        >
                            <Option value="a">Action A</Option>
                            <Option value="b">Action B</Option>
                            <Option value="c">Action C</Option>
                        </Select>
                        <Typography> from </Typography>
                        <Input type="time"></Input>
                        <Typography> to </Typography>
                        <Input type="time"></Input>
                    </Stack>
                    <Button startDecorator={<AddIcon />} size="sm">
                        New Schedule
                    </Button>
                </Stack>
            </Card>
            <Card sx={{ bgcolor: "yellow" }}>
                A list to display current Schedules
            </Card>
        </Stack>
    );
};

const DeviceDetailModal = ({ deviceId }) => {
    const [deviceDetail, setDeviceDetail] = useState(0);
    const [sliderValue, setSliderValue] = useState(50); // Default value set to 50 for demonstration
    const deviceDetailRef = useRef(deviceDetail); 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [actions, setActions] = useState([]);
    const [newAction, setNewAction] = useState({ actionType: 'a', threshold: '' });

    useEffect(() => {
        deviceDetailRef.current = deviceDetail; // Update ref whenever deviceDetail changes
    }, [deviceDetail]);
    
    useEffect(() => {
        const fetchDeviceDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/device/${deviceId}`);
                console.log("Fetched device details:", response.data.device);
                setDeviceDetail(response.data.device);
            } catch (error) {
                console.error("Failed to fetch device details:", error);
            }
        };
    
        fetchDeviceDetail();
    }, [deviceId]);

    const handleSliderChange = (event, newValue) => {
        console.log("Slider changing to:", newValue);
        setSliderValue(newValue);
    };
    const handleActionTypeChange = (event) => {
        setNewAction(prev => ({ ...prev, actionType: event.target.value }));
    };
    
    const handleThresholdChange = (event) => {
        setNewAction(prev => ({ ...prev, threshold: event.target.value }));
    };
    
    const addNewAction = () => {
        if (newAction.threshold !== '' && !isNaN(newAction.threshold)) {
            setActions(prev => [...prev, newAction]);
            setNewAction({ actionType: 'a', threshold: '' }); // Reset the form after adding
        } else {
            alert('Please enter a valid threshold value.');
        }
    };
    const renderActions = () => {
        return actions.map((action, index) => (
            <Box key={index} sx={{ mt: 2, p: 2, bgcolor: 'background.paper' }}>
                <Typography>Trigger {action.actionType} on value {action.threshold}</Typography>
            </Box>
        ));
    };

    const saveChanges = async () => {
        const detail = deviceDetailRef.current;
        console.log("Saving changes for device:", detail);
        const ADAFRUIT_IO_USERNAME = "1zy";
        const ADAFRUIT_IO_KEY = "aio_Csiu15Rnws3r2rPqdCtv54ZwYUrW";
        const relevantIds = ["led", "fan"];

        try {
            for (const idPart of relevantIds) {
                if (detail && detail.deviceID.toLowerCase().includes(idPart)) {
                    const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${detail.deviceID}/data`;
                    const response = await axios.post(url, { value: sliderValue.toString() }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-AIO-Key': ADAFRUIT_IO_KEY,
                        }
                    });
                    console.log("Posted device data successfully:", response.data);
                    setSnackbarMessage('Changes applied successfully!');
                    setOpenSnackbar(true);
                }
            }
            actions.forEach(action => {
                if (sliderValue >= Number(action.threshold)) {
                    if (action.actionType === 'a') {
                        turnDeviceDown();
                    }
                    else if (action.actionType === 'b') {
                        notifyDevice();
                    }
                    else if (action.actionType === 'c') {
                        turnDeviceOff();
                    }
                    // Add other actions like notify or reduce power here
                }
            });
    
     
        } catch (error) {
            console.error("Failed to post device data:", error);
            setSnackbarMessage('Failed to apply changes.');
            setOpenSnackbar(true);
        }
    };
    const ThresholdActionSection = memo(({
        actions,
        setActions,
        newAction,
        setNewAction,
        handleActionTypeChange,
        handleThresholdChange,
        addNewAction,
    }) => {
        // Use useCallback to memoize the handlers
        const memoizedHandleActionTypeChange = useCallback(handleActionTypeChange, []);
        const memoizedHandleThresholdChange = useCallback(handleThresholdChange, []);
        const memoizedAddNewAction = useCallback(addNewAction, []);
    
        return (
            <Stack direction="column">
                <Typography level="h3">Threshold action 1</Typography>
                <Card>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography>Trigger</Typography>
                            <Select
                                placeholder="Select an action"
                                name="foo"
                                value={newAction.actionType}
                                onChange={memoizedHandleActionTypeChange}
                                sx={{ minWidth: 200 }}
                            >
                                <Option value="a">Action A (Reduce Power)</Option>
                                <Option value="b">Action B (Notify)</Option>
                                <Option value="c">Action C (Turn Off)</Option>
                            </Select>
                            <Typography> on value </Typography>
                            <Input
                                sx={{ width: 100 }}
                                placeholder="value..."
                                type="number"
                                value={newAction.threshold}
                                onChange={memoizedHandleThresholdChange}
                            ></Input>
                        </Stack>
                        <Button startDecorator={<AddIcon />} size="sm" onClick={memoizedAddNewAction}>
                            Add Action
                        </Button>
                    </Stack>
                </Card>
                <Card sx={{ bgcolor: "yellow", mt: 2 }}>
                    {renderActions()}
                </Card>
            </Stack>
        );
    });
    
    const turnDeviceDown = async () => {
        const ADAFRUIT_IO_USERNAME = "1zy";
        const ADAFRUIT_IO_KEY = "aio_Csiu15Rnws3r2rPqdCtv54ZwYUrW";
        try {
            const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${deviceDetailRef.current.deviceID}/data`;
            const response = await axios.post(url, { value: "50" }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-AIO-Key": ADAFRUIT_IO_KEY,
                }
            });
            setSnackbarMessage('Device reduce intensity due to threshold breach!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Failed to turn down the device:", error);
            setSnackbarMessage('Failed to reduce intensity of the device.');
            setOpenSnackbar(true);
        }
    };
    const turnDeviceOff= async () => {
        const ADAFRUIT_IO_USERNAME = "1zy";
        const ADAFRUIT_IO_KEY = "aio_Csiu15Rnws3r2rPqdCtv54ZwYUrW";
        try {
            const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${deviceDetailRef.current.deviceID}/data`;
            const response = await axios.post(url, { value: "0" }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-AIO-Key": ADAFRUIT_IO_KEY,
                }
            });
            setSnackbarMessage('Device turned off due to threshold breach!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Failed to turn down the device:", error);
            setSnackbarMessage('Failed to turn off the device.');
            setOpenSnackbar(true);
        }
    };
    const notifyDevice = async () => {
        setSnackbarMessage('Notification sent due to threshold breach!');
        setOpenSnackbar(true);
    }
    

    return (
        <Card>
            {deviceDetail ? (
                <Box>
                    <DialogHeader deviceDetail={deviceDetail} onSave={saveChanges} />
                    <DialogContent>
                        <Stack direction="column" spacing={4}>
                            <GeneralInfo deviceDetail={deviceDetail} />
                            <SliderControl sliderValue={sliderValue} onSliderChange={handleSliderChange} />
                            <ThresholdActionSection actions={actions} setActions={setActions}
                                                    newAction={newAction} setNewAction={setNewAction}
                                                    handleActionTypeChange={handleActionTypeChange}
                                                    handleThresholdChange={handleThresholdChange}
                                                    addNewAction={addNewAction} />
                            {/* <ScheduleSection /> */}
                        </Stack>
                    </DialogContent>
                </Box>
            ) : (
                <Stack direction="column" alignItems="center" justifyContent="center" sx={{ m: 6 }}>
                    <CircularProgress variant="solid" />
                    <Typography level="body-lg">Your device is being prepared...</Typography>
                </Stack>
            )}
         <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
            <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        </Card>
    );
};



export default DeviceDetailModal;
