import {
    FormControl,
    Input,
    FormHelperText,
    Button,
    IconButton,
    Stack,
    Box,
    Tooltip,
    Select,
    Option,
    MenuButton,
    MenuItem,
    Dropdown,
    Menu,
    Typography,
} from "@mui/joy";
import { Search, Settings } from "@mui/icons-material";

const SearchUserButton = () => {
    return (
        <Button
            variant="solid"
            color="primary"
            startDecorator={<Search />}
            size="lg"
        >
            Search
        </Button>
    );
};

const SearchSettingsButton = () => {
    return (
        <Select
            size="sm"
            defaultValue="name"
            renderValue={(selected) => (
                <Box>
                    <Typography>Search by {selected.value}</Typography>
                </Box>
            )}
            color="primary"
        >
            <Option value="name">by name...</Option>
            <Option value="email">by email...</Option>
        </Select>
    );
};

const UserSearch = () => {
    return (
        <FormControl>
            <Input
                startDecorator={<SearchSettingsButton />}
                endDecorator={<SearchUserButton />}
                placeholder="Search users..."
                size="lg"
            />
            {/* Deprecate this: */}
            {/* <FormHelperText>1029 users found.</FormHelperText> */}
        </FormControl>
    );
};

export default UserSearch;
