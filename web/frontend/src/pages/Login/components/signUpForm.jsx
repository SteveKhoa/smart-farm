import React, { useState } from "react";
import {
    Stack,
    Card,
    Typography,
    Link,
    TextField,
    InputAdornment,
} from "@mui/material";
import Button from "@mui/joy/Button";
import { Person, VpnKey, Email } from "@mui/icons-material";

const SignUpForm = ({ setLogin }) => {
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        fullname: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        setError(""); // Clear error message
        // Assume your API endpoint for user creation is /api/user
        try {
            const response = await fetch("http://localhost:3000/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    fullname: userData.fullname,
                    role: "user",
                }),
            });
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            alert("User created successfully!");
            setLogin(true);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Card
            sx={{
                minWidth: "25vw",
                minHeight: "60vh",
                backgroundColor: "#f5f5f5", // Example background color
                borderRadius: "16px", // Rounded corners
                boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)", // Box shadow for depth
                p: 4,
            }}
        >
            <Stack spacing={3}>
                <Stack spacing={2}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, textAlign: "center" }}
                    >
                        Sign Up
                    </Typography>
                    <Typography textAlign="center">
                        Already have an account?&nbsp;
                        <Link
                            component="button"
                            onClick={() => setLogin(true)}
                            underline="always"
                        >
                            Sign In
                        </Link>
                    </Typography>
                    {error && (
                        <Typography color="error" textAlign="center">
                            {error}
                        </Typography>
                    )}
                </Stack>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} alignItems="center">
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="email"
                            placeholder="Email"
                            type="email"
                            value={userData.email}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="fullname"
                            placeholder="Full Name"
                            value={userData.fullname}
                            type="text"
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="password"
                            placeholder="Password"
                            value={userData.password}
                            type="password"
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKey />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={userData.confirmPassword}
                            type="password"
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKey />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            sx={{
                                marginTop: 2,
                                width: "100%",
                                bgcolor: "primary.main",
                                ":hover": { bgcolor: "primary.dark" },
                            }}
                        >
                            Sign Up
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Card>
    );
};

export default SignUpForm;
