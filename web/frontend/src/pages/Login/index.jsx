import { useState } from "react";

import { Box, Container, Stack } from "@mui/joy";

import SignInForm from "./components/signInForm";
import SignUpForm from "./components/signUpForm";
import Title from "./components/title";

const Login = () => {
    const [isLogin, setLogin] = useState(true);

    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                justifyContent: "space-evenly",
                height: "100vh",
                alignItems: "center",
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={10}
            >
                <Title />
                <Box>
                    {isLogin && <SignInForm setLogin={setLogin} />}
                    {!isLogin && <SignUpForm setLogin={setLogin} />}
                </Box>
            </Stack>
        </Container>
    );
};

export default Login;
