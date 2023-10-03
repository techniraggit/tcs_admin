import React, { useState , useEffect } from 'react'
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import GoToTop from "../components/GoToTop";
// import { resetMessage } from "../redux/actions/messageActions";
// import { connect } from 'react-redux';

const Alert = React.forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Layout() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    useEffect(() => {
        const sessionExpiredListener = () => {
            setSnackbarOpen(true);
        };
        window.addEventListener('sessionExpired', sessionExpiredListener);
        return () => {
            window.removeEventListener('sessionExpired', sessionExpiredListener);
        };
    }, []);
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="body-wrapper">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="bodyWrap">
                <Header />
                <div className="mainContentWrap">
                    <Outlet />
                </div>
            </div>

            {/* <Footer /> */}
            <GoToTop />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000} 
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="error">
                    Your session has expired. Please log in again.
                </Alert>
            </Snackbar>
        </div>


    )
}


export default Layout;