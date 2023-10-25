import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { doctorlisting } from "../apis/adminApis";

import { Button, Typography, Grid, FormControl, Paper } from "@mui/material";

export default function CalendarDoc() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [submitEnabled, setsubmitEnabled] = useState(null);
  const [allDocs, setAllDocs] = useState([]);
  useEffect(() => {
    if (selectedDate != null && selectedTime != null && selectedDoc != null) {
      console.log(selectedDate, selectedTime, selectedDoc);
      setsubmitEnabled(true);
    }
  }, [selectedDate, selectedTime, selectedDoc]);
  useEffect(() => {
    doctorlisting().then((doctors) => setAllDocs(doctors.data.data));
  }, []);

  const submitAppointment = () => {
    //Submit to backend
  };

  return (
    <div>
      <Typography
        variant="font22"
        mb={4}
        sx={{ fontWeight: "700" }}
        component="h1"
      >
        {" "}
        Create a appointment{" "}
      </Typography>
      <div className="top-total-wrap">
        <div className="left">
          <div className="text-wrap">
            <h6>Select Doctor: </h6>
          </div>
        </div>
        <select
          onChange={(event) => {
            setSelectedDoc(event.target.value);
          }}
        >
          {allDocs.map((doc) => {
            return (
              <option key={doc.user.id} value={doc.user.id}>
                {doc.user.first_name} {doc.user.last_name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="top-total-wrap">
        <div className="left">
          <div className="text-wrap">
            <h6>Select Date:</h6>
          </div>
        </div>
        <Calendar
          disabled={true}
          disableCalendar={true}
          onChange={setSelectedDate}
          value={selectedDate}
          format="y-MM-dd"
        />
      </div>
      <div className="top-total-wrap">
        <div className="left">
          <div className="text-wrap">
            <h6>Select Time:</h6>
          </div>
        </div>
        <TimePicker onChange={setSelectedTime} value={selectedTime} />
      </div>
      {submitEnabled && (
        <Button
          className="buttonPrimary medium"
          variant="contained"
          fullWidth
          onClick={() => {
            submitAppointment();
          }}
        >
          Book Appointement
        </Button>
      )}
      
    </div>
  );
}
