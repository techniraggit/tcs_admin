import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import SidebarLogo from '../assets/images/eyemyeye-logo.png';
import Appointmenticon from '../assets/images/appointment.svg';
import PatientIcon from '../assets/images/patient.svg';
import NotificationIcon from '../assets/images/notification.svg';
import LogoutIcon from '../assets/images/Logout.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faHandsHolding, faGear } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

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
          <li className={`${location.pathname === '/appointments' ? 'active' : ''} `}>
            <Link to="/appointments">
                <FontAwesomeIcon icon={faCalendarCheck} />
                Appointments
            </Link>
          </li>
          <li className={`${location.pathname === '/setting' ? 'active' : ''} `}>
            <Link to="/setting">
                <FontAwesomeIcon icon={faGear} />
                Settings
            </Link>
          </li>
          {/* <li className={`${location.pathname === '/calender' ? 'active' : ''} `}>
            <Link to="/calendar">
                <FontAwesomeIcon icon={faCalendar} />
                Calender
            </Link>
          </li>
          <li className={`${location.pathname.includes('meeting') ? 'active' : ''} `}>
            <Link to="/meeting/test">
                <FontAwesomeIcon icon={faHandsHolding} />
                Meeting
            </Link>
          </li> */}
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