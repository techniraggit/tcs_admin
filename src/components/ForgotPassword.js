import React, { useState } from "react";
import Button from "@mui/material/Button";
import {
    TextField,
    InputLabel,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import logoWhite from "../assets/images/eyemy-logo-white.svg";
import LoginImg from "../assets/images/login-img.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import GoToTop from "../components/GoToTop";
// import { resetMessage } from "../redux/actions/messageActions";
// import { connect } from "react-redux";


function SignInForm(props) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {

    };

    return (
        <>
            <form className="customForm">
                <InputLabel className="customLabel" htmlFor="email">
                    Email
                </InputLabel>
                <TextField
                    className="customField"
                    placeholder="Enter Your Email"
                    fullWidth
                    id="email"
                    type="email"
                />
                <Link block onClick={() => { navigate('/') }} mb={5} variant="font16" sx={{ color: '#000', textAlign: 'right', display: 'block' }}>
                    Back To Login
                </Link>
                <Button
                    className="buttonPrimary big"
                    variant="contained"
                    color="primary"
                    fullWidth
                // onClick={handleSubmit}
                >
                    Reset Password <FontAwesomeIcon icon={faArrowRight} />
                </Button>
            </form>
        </>
    );
}

const ForgotPassword = () => {
    return (
        <Stack className="login-wrap">
            <Grid
                container
                component="main"
                sx={{ height: "100vh", alignItems: "center" }}
            >
                {/* Left Info Sidebar */}
                <Grid item className="left-wrap">
                    <div className="topContentWrap">
                        <img src={logoWhite} alt="My Image" />
                        <Typography
                            mb={10}
                            variant="font20"
                            component="h4"
                            sx={{ color: "#fff", fontWeight: "600", mt: 4, textTransform: 'capitalize' }}
                        >
                            Get ready for your moment of clarity!
                        </Typography>
                    </div>
                    <div className="img-outer">
                        <img src={LoginImg} alt="Doctor Image" />
                    </div>
                </Grid>
                {/* Right Form Wrappper */}
                <Grid item className="right-wrap">
                    <Box sx={{ my: 6, mx: [4, 4, 6] }}>
                        <Stack mb={10} sx={{ textAlign: "center", display: "block" }}>
                            <Typography variant="h1">Welcome to Admin Portal </Typography>
                        </Stack>

                        <div className="form-outer">
                            <Typography variant="h1">Forgot Password</Typography>
                            <Typography
                                mb={5}
                                mt={1}
                                variant="body"
                                sx={{ color: "#6A6A6A" }}
                                component="p"
                            >
                                No worries, we'll send you reset instructions!
                            </Typography>
                            <SignInForm sx={{ mt: 5 }} />
                        </div>
                        {/* <Snackbar
            open={message.message !== ""}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={`${message.error ? "error" : "success"}`}
              sx={{ width: "100%" }}
            >
              {message.message}
            </Alert>
          </Snackbar> */}
                    </Box>
                </Grid>
            </Grid>
        </Stack>
    )
}

export default ForgotPassword