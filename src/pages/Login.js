import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  TextField,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import logoWhite from "../assets/images/eyemy-logo-white.svg";
import LoginImg from "../assets/images/login-img.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { navigate, useNavigate } from 'react-router-dom';
import { logIn } from '../apis/adminApis';
import { Snackbar, Alert } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  // show error msg
  const [successSnackbar, setSuccessSnackbar] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (!validateEmail(newEmail)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  useEffect(()=>{
    if(localStorage.getItem('token')){
      navigate("/dashboard")
    }
  },[]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    logIn(data)
      .then((response) => {
        if (response?.data?.status) {
          const token = response.data.access_token;
          const name = response.data.first_name;
          localStorage.setItem('name', name);
          localStorage.setItem("token", token);
          setSuccessSnackbar("You have logged in successfully.");
          navigate("/dashboard");
        } else {
          setSnackbarMessage("Invalid credentials. Please try again.");
        }
      })
      .catch((error) => {
        if (error?.response?.data?.code === 'token_not_valid') {
          setSnackbarMessage("Your session has expired. Please log in again.");
          localStorage.removeItem('token');
        }
        setSnackbarMessage("You're not a valid user to access this!");
      });
  };

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
              <Typography variant="h1">Sign In</Typography>
              <Typography
                mb={5}
                mt={1}
                variant="body"
                sx={{ color: "#6A6A6A" }}
                component="p"
              >
                Sign In to Get started
              </Typography>

              <form onSubmit={handleSubmit} className="customForm">
                <div className="customField">
                  <InputLabel className="customLabel" htmlFor="email">
                    Email
                  </InputLabel>
                  <TextField
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    id="email"
                    autoComplete="off"
                    error={!!emailError}
                    helperText={emailError}
                  />

                </div>

                <div className="customField">
                  <InputLabel className="customLabel" htmlFor="password">
                    Password
                  </InputLabel>

                  <TextField
                    id="password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    autoComplete="off"
                    className="passwordField"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                </div>

                <Button
                  className="buttonPrimary big"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Login <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </form>

              <Snackbar
                open={successSnackbar}
                autoHideDuration={6000}
                onClose={() => setSuccessSnackbar(false)}
              >
                <Alert onClose={() => setSuccessSnackbar(false)} severity="success">
                  {successSnackbar}
                </Alert>
              </Snackbar>

              <Snackbar
                open={snackbarMessage}
                autoHideDuration={6000}
                onClose={() => setSnackbarMessage(false)}
              >
                <Alert onClose={() => setSnackbarMessage(false)} severity="error">
                  {snackbarMessage}
                </Alert>
              </Snackbar>

            </div>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  )
}


export default Login;
