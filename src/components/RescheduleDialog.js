import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, Stack, IconButton, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {AppointmentTimeSlot, saveRescheduleAppointment} from '../apis/adminApis';
import dayjs from 'dayjs';

const RescheduleDialog = ({ open, onClose, appointmentId, onSelectedTypeChange, selectedType, logSelectedType }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs('2023-10-09')); 
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rescheduleSaved, setRescheduleSaved] = useState(false);

   const handleDateChange = async (newDate) => {
    setSelectedDate(newDate);
    try {
      const formattedDate = newDate.format('YYYY-MM-DD');
      const response = await AppointmentTimeSlot(formattedDate);
      setTimeSlots(response?.data?.data);
      setSelectedTime(null);
    } catch (error) {
      console.error(error);
    } 
  };

  const handleTimeClick = (slot) => {
    setSelectedTime(slot);
  };

  const handleSaveChanges = async () => {
    if (selectedTime) {
      try {
        const data = {
          date: selectedDate.format('YYYY-MM-DD'),
          time: selectedTime,
          appointment_id: appointmentId,
        };
        await saveRescheduleAppointment(data);
        console.log('slot change', data)
        
        setRescheduleSaved(true);
        onSelectedTypeChange(appointmentId, selectedType);
        console.log('jjjjj', selectedType)
        logSelectedType(); 
        onClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div style={{ width: 600 }}>
        <Stack className='popupHeader'>
          <DialogTitle> Reschedule Appointment</DialogTitle>
          <IconButton disableRipple type="button" onClick={onClose} sx={{ p: '0px', color: '#000' }}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </IconButton>
        </Stack>
        <DialogContent>
          <div className='reschedule-wrap'>
            <h4>Select date</h4>
            <div className='date-drodown'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker value={selectedDate} onChange={handleDateChange} />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <h4>Available Time</h4>
            {timeSlots.length > 0 ?
              <ul className="time-outer">
                {timeSlots?.map((slot) => 
                  <li key={slot.id}  className={selectedTime === slot.start_time ? 'active' : ''} onClick={() => handleTimeClick(slot.start_time)}>{slot.start_time} <strong>To</strong> {slot.end_time}</li>
                )}
              </ul>
              :
              <p className='no-time-text'>Time slots for selected date is not available, select another date!  </p>
            }
             

            <div className='btn-wrap'>
              <Button onClick={() => handleSaveChanges()} className="buttonPrimary small" variant="contained" disabled={!selectedTime}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  )
}

export default RescheduleDialog