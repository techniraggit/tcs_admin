import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, Stack, IconButton, Typography, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import ScheduleAIcon from '../../assets/images/white-calendar.svg';
import PatientIcon from '../../assets/images/user.svg';
import MedicalHIcon from '../../assets/images/heart.svg';
import NoteIcon from '../../assets/images/edit.svg';

const AppointmentDetailDialog = ({ open, onClose }) => {

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth={800}>
        <div style={{ width: 780 }}>
          <Stack className='popupHeader'>
            <DialogTitle> Appointment Reports</DialogTitle>
            <IconButton disableRipple type="button" onClick={onClose} sx={{ p: '0px', color: '#000' }}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </IconButton>
          </Stack>
          <DialogContent>
            <ul className="updated-details">
              <li>
                <span className="icon"><img src={ScheduleAIcon} alt='Scheduled Appointment' /></span>
                <div className="right-wrap">
                  <h6>Scheduled Appointment</h6>
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}>Today, December 22, 2022  <span>10:00 - 10:30 AM (30 minutes)</span> </p>
                </div>
              </li>
              <li>
                <span className="icon"><img src={PatientIcon} alt='Patient Information ' /></span>
                <div className="right-wrap">
                  <h6>Patient Information </h6>
                  <ul>
                    <li><span>Full Name </span> : Andrew Ainsley </li>
                    <li><span>Gender </span> : Male </li>
                    <li><span>Age </span> : 27 </li>
                  </ul>
                </div>
              </li>
              <li>
                <span className="icon"><img src={MedicalHIcon} alt='Medical History' /></span>
                <div className="right-wrap">
                  <h6>Medical History</h6>
                  <p>Relevant medical conditions or pre-existing health issues. <strong>No</strong> </p>
                  <span className="border-wrap">
                    Current medications or treatments the customer is undergoing. <strong> Yes </strong>
                    <a>Lorem ipsum dolor sit amet consectetur. Convallis malesuada nunc morbi feugiat mi. </a>
                  </span>
                  <p>Relevant medical conditions or pre-existing health issues. <strong>No</strong> </p>
                </div>
              </li>
              <li>
                <span className="icon"><img src={NoteIcon} alt='Additional Notes' /></span>
                <div className="right-wrap">
                  <h6>Additional Notes</h6>
                  <p>Lorem ipsum dolor sit amet consectetur. Vitae quis tortor orci nisl eu posuere sollicitudin. Porttitor viverra eu ac enim ultrices lacinia lacus integer diam. Sed ultricies velit id hendrerit arcu purus at maecenas. Vestibulum adipiscing tellus mauris eget maecenas. Laoreet ut suspendisse ut risus nunc iaculis. Dignissim pulvinar mi maecenas nisi dolor amet nunc quis sed. </p>
                </div>
              </li>
            </ul>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}

export default AppointmentDetailDialog;
