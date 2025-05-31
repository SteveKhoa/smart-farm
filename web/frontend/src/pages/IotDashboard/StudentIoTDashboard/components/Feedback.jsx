import {
    Button,
    Grid,
    Modal,
    ModalDialog,
    DialogTitle,
    DialogContent,
    Input,
    Select,
    Textarea,
    Typography,
    Chip,
    Option,
} from "@mui/joy";
import { Report } from "@mui/icons-material";
import { useState } from "react";

const FeedbackButton = () => {
    const [open, setOpen] = useState(false);

    const FeedbackFormModal = ({ open, setOpen }) => {
        return (
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Report device's issue</DialogTitle>
                    <DialogContent>
                        <Select placeholder="Severity">
                            <Option value="critical">Critical</Option>
                            <Option value="adequate">Adequate</Option>
                            <Option value="low">Low</Option>
                        </Select>
                        <Select placeholder="Device">
                            <Option value="id01">
                                <Typography endDecorator={<Chip>B4-101</Chip>}>
                                    Quạt
                                </Typography>
                            </Option>
                            <Option value="id02">
                                <Typography endDecorator={<Chip>B4-101</Chip>}>
                                    Quạt
                                </Typography>
                            </Option>
                            <Option value="id03">
                                <Typography endDecorator={<Chip>B4-101</Chip>}>
                                    Quạt
                                </Typography>
                            </Option>
                        </Select>
                        <Textarea placeholder="Enter additional information about the issue..." />
                        <Button color="primary">Submit</Button>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        );
    };

    return (
        <Grid xs={4}>
            <Button
                startDecorator={<Report />}
                color="danger"
                onClick={() => setOpen(true)}
            >
                Report device's issue
            </Button>
            <FeedbackFormModal open={open} setOpen={setOpen} />
        </Grid>
    );
};

export default FeedbackButton;
