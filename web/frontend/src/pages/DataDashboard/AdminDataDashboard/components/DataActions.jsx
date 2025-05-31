import { Typography, Grid, Stack, Card, Box } from "@mui/joy";

import PanToolIcon from "@mui/icons-material/PanTool";

const DataActions = () => {
    return (
        <Stack direction="column" spacing={2}>
            <Typography color="neutral" endDecorator={<PanToolIcon />}>
                Data Actions
            </Typography>
            <Card>
                Maybe some buttons here but don't implement this right now
            </Card>
        </Stack>
    );
};

export default DataActions;
