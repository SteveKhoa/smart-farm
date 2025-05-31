import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../features/userSlice"; // Cập nhật đường dẫn nếu cần
import { Navigate, useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import { Avatar, IconButton } from "@mui/joy";
import { ListItemContent } from "@mui/joy";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider } from "@mui/joy";
import routes from "appRoutes";
import axios from "axios";

const SideNav = ({ focusOnRouteID }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authToken = localStorage.getItem("authToken");
    const userData = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                // Dispatch setUser action với dữ liệu người dùng nhận được
                dispatch(setUser(response.data));

            } catch (error) {
                console.error("Failed to fetch user data:", error);
                // Optional: handle logout or redirect to login page here
            }
        };

        if (authToken) {
            fetchUserData();
        }
    }, [authToken, dispatch]);

    const submitSignOut = () => {
        localStorage.removeItem("authToken"); 
        navigate("/portal"); 
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "left",
                gap: 2,
                flexWrap: "wrap",
                "& > *": { minWidth: 0, flexBasis: 200 },
                width: 250,
                height: 700,
                position: "fixed",
            }}
        >
            <List
                size="md"
                variant="soft"
                sx={{
                    borderRadius: "16px",
                    p: 1,
                    pt: 2,
                    "--ListItemDecorator-size": "56px",
                }}
            >
               <ListItem>
                    <ListItemDecorator>
                        <Avatar sx={{ bgcolor: "neutral.softColor" }} />
                    </ListItemDecorator>
                    <ListItemContent>
                        <Typography level="title-md" noWrap>
                            {userData.fullname} 
                        </Typography>
                        <Typography level="body-sm">
                            {userData.role} 
                        </Typography>
                    </ListItemContent>
                    <IconButton onClick={submitSignOut} sx={{ color: "neutral.solidBg" }}>
                        <LogoutIcon />
                    </IconButton>
                </ListItem>
                <Divider orientation="horizontal" sx={{ my: 3 }} />

                {routes.filter(route => {
    // Show all routes that don't require admin privileges or check for admin role
    return route.key !== "admindashboard" || userData.role === "admin";
}).map((route) => (
    <ListItem key={route.key}>
        <ListItemButton onClick={() => navigate(route.route)} selected={focusOnRouteID === route.key}>
            <ListItemDecorator sx={{ color: "neutral.solidBg" }}>
                {route.icon}
            </ListItemDecorator>
            {route.name}
        </ListItemButton>
    </ListItem>
))}
            </List>
        </Box>
    );
};

export default SideNav;
