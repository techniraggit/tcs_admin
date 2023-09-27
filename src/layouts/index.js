import React from 'react'
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
            {/* <Snackbar open={message.message !== ''} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={`${message.error ? 'error' : 'success'}`} sx={{ width: '100%' }}>
                    {message.message}
                </Alert>
            </Snackbar> */}
        </div>

    )
}


export default Layout;