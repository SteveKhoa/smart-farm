import React from "react";

import { Stack, Box } from "@mui/joy";
import { Typography, Link, Container } from "@mui/material";

const Title = () => {
    return (
        <Box sx={{ width: 500 }}>
            <Stack spacing={2}>
                <Typography variant="h1" sx={{ fontWeight: 700 }}>
                    Smart Classroom
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 400 }}>
                    Experience the future of classroom. Today.
                </Typography>
            </Stack>
        </Box>
    );
};

export default Title;
