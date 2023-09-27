import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import SidebarLogo from '../assets/images/eyemyeye-logo.png';
import Appointmenticon from '../assets/images/appointment.svg';
import PatientIcon from '../assets/images/patient.svg';
import NotificationIcon from '../assets/images/notification.svg';
import LogoutIcon from '../assets/images/Logout.svg';

function Sidebar() {
  const location = useLocation();

  return (
    <>
      <Link to="/"> <img src={SidebarLogo} alt="POS EyeMyeye" /></Link>
      <nav className='retailerSidebar'>
        <ul>
          <li className={`${location.pathname === '/dashboard' ? 'active' : ''} `}>
            <Link to="/dashboard">
              <img src={Appointmenticon} alt="Dashboard" /> 
              Dashboard
            </Link>
          </li>
          <li className={`${location.pathname === '/doctor' ? 'active' : ''} `}>
            <Link to="/doctor">
              <img src={PatientIcon} alt="Doctor" />
              Doctor
            </Link>
          </li>
          <li className={`${location.pathname === '/notifications' ? 'active' : ''} `}>
            <Link to="/notifications">
              <img src={NotificationIcon} alt="Notifications" />
                Notifications
            </Link>
          </li>
        </ul>
        <Link to="/" className='logout-wrap'>
          <img src={LogoutIcon} alt="Log out" />
          Log out
        </Link>
      </nav>
    </>
  )
}

export default Sidebar;