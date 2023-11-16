import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { DialogTitle, Stack, IconButton, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  AppointmentTimeSlot,
  saveRescheduleAppointment,
} from "../apis/adminApis";
import dayjs from "dayjs";
import axios from "../apis/axiosConfig";

const RescheduleDialog = ({
  open,
  onClose,
  appointmentId,
  onSelectedTypeChange,
  selectedType,
  logSelectedType,
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs("2023-10-09"));
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rescheduleSaved, setRescheduleSaved] = useState(false);

  const handleDateChange = async (newDate) => {
    setSelectedDate(newDate);
    try {
      const formattedDate = newDate.format("YYYY-MM-DD");
      let myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Token QzECldEQkWZDHTzGa4V7uhCqshJRRHmcQlgWWvXkBkqMG"
      );

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        axios.defaults.baseURL+"/user/time_slots?date="+formattedDate,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {setTimeSlots(
          JSON.parse(result)?.data);
        })
        .catch((error) => console.log("error", error));
      
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
      const updatedTime = selectedTime.split(":")[0] + ":" +selectedTime.split(":")[1];
      try {
        const raw = JSON.stringify({
          "date": selectedDate.format("YYYY-MM-DD").toString(),
          "time": updatedTime.toString(),
          "appointment_id": parseInt(appointmentId),
        });
        let myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Token QzECldEQkWZDHTzGa4V7uhCqshJRRHmcQlgWWvXkBkqMG"
      );
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        redirect: "follow",
        body:raw
      };

      fetch(
        axios.defaults.baseURL+"/user/reschedule_meeting",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          console.log(JSON.parse(result)?.data);
          window.location.reload();})
        .catch((error) => console.log("error", error));
        console.log("slot change", raw);

        setRescheduleSaved(true);
        onSelectedTypeChange(appointmentId, selectedType);
        console.log("jjjjj", selectedType);
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
        <Stack className="popupHeader">
          <DialogTitle> Reschedule Appointment</DialogTitle>
          <IconButton
            disableRipple
            type="button"
            onClick={onClose}
            sx={{ p: "0px", color: "#000" }}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </IconButton>
        </Stack>
        <DialogContent>
          <div className="reschedule-wrap">
            <h4>Select date</h4>
            <div className="date-drodown">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <h4>Available Time</h4>
            {timeSlots?.length > 0 ? (
              <ul className="time-outer">
                {timeSlots?.map((slot, index) => (
                  <li
                    key={index}
                    className={selectedTime === slot.slot_time ? "active" : ""}
                    onClick={() => handleTimeClick(slot.slot_time)}
                  >
                    {slot.slot_time}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-time-text">
                Time slots for selected date is not available, select another
                date!{" "}
              </p>
            )}

            <div className="btn-wrap">
              <Button
                onClick={() => handleSaveChanges()}
                className="buttonPrimary small"
                variant="contained"
                disabled={!selectedTime}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default RescheduleDialog;
