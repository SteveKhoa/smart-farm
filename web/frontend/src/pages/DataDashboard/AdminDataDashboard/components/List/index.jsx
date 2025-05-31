import React, { useEffect, useState } from "react";
import axios from "axios";
import { Stack, Chip, Box, Typography, Card } from "@mui/joy";
import Surface from "../DevicesPieSurface/DevicesPieSurface";

const DeviceList = ({ name, children }) => {

    return (
        <Stack spacing={6} direction="column">

            <Stack spacing={1} direction="column">
                <Stack spacing={1} direction="row">
                    <Typography sx={{ color: "neutral.500" }}>
                        {name}
                    </Typography>
                </Stack>
                <Stack
                    spacing={2}
                    direction="row"
                    flexWrap="nowrap"
                    sx={{ overflow: "auto" }}
                >
                    {children}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default DeviceList;
