import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useQuery } from "@tanstack/react-query";
import * as Yup from "yup";
import {
  InputLabel,
  TextField,
  Typography,
  Paper,
  Grid,
  Button,
  Autocomplete,
} from "@mui/material";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { getNotificationType, getDoctorsEmails, createNotification } from "../apis/adminApis";

const CreateNotification = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [emails, setEmails] = useState([]);
  const [doctorEmail, setDoctorEmail] = useState([]);
  const [open, setOpen] = useState(false);

  const validationSchema = Yup.object({
    subject: Yup.string().required("Subject is required!").test('len', 'Must be less than 100', val => val.length < 100),
    description: Yup.string().required("Description is required!"),
  });

  const handleRetailerChange = (event, value) => {
    setDoctorEmail(value);
  };
  const subjectCount = (event) => {
    console.log(event.target.value.length);
  }
  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setDoctorEmail(checked ? emails : []);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  useEffect(() => {
    getNotificationType()
      .then(response => {
        setNotificationTypes(response.data?.notification_types);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  useEffect(() => {
    getDoctorsEmails()
      .then(response => {
        setDoctorEmail(response.data?.doctor_emails);
        // Update the 'emails' state here to match the fetched data
        setEmails(response.data?.doctor_emails || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  const onSubmit = (values) => {
    console.log("pppppppppppppppp", values)
    const payload = {
      notification_type: selectedType,
      user_emails: doctorEmail,
      title: values.subject,
      message: values.description,
    };

    createNotification(payload).then((response) => {
      console.log('API Response:', response);
      if (response?.data?.status) {
        navigate("/notifications");
      } else {
        console.error('API Error:', response?.data?.error); // Log the error message
      }
    }).catch((error) => {
      console.error('API Request Error:', error); // Log any request errors
    });

  };


  return (
    <div>
      <Formik
        initialValues={{
          selectAll: false,
          subject: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => ( 
        <Form className="customForm">
          <Paper className="formMainWrap">
            <Typography
              mb={3}
              sx={{ fontWeight: "700", fontSize: "18px" }}
              component="h1"
            >  <Link className="back-btn" to='/notifications'><FontAwesomeIcon icon={faArrowLeftLong} /></Link>
              Create Notifications
            </Typography>
            <Grid item xs={12} md={4} className="customField">
              <InputLabel className="customLabel" htmlFor="subject">
                Notification Type <span>*</span>
              </InputLabel>
              <Select
                  className="select-field"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedType}
                  onChange={handleTypeChange}
                  name="notificationType"
                  fullWidth
                >
                  <MenuItem value="">Select Notification Type </MenuItem>
                  {notificationTypes?.map(type => {
                       return <MenuItem key={type} value={type}> {type} </MenuItem>
                  })}
                </Select>
            </Grid>
            <Grid item xs={12} md={4} style={{marginBlock:'20px'}}>
              <InputLabel className="customLabel" htmlFor="doctorEmails">
                Retailer Emails <span>*</span>
              </InputLabel>
         
              <Autocomplete
                multiple
                id="doctorEmail"
                name="doctorEmail"
                options={emails}
                value={doctorEmail}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                open={open}
                disableCloseOnSelect
                onChange={(event, value) => handleRetailerChange(event, value)}
                getOptionLabel={(option) => (option === "All" ? "" : option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder={
                      doctorEmail.length > 0 ? "" : "Select retailer emails"
                    }
                  />
                )}
              />
              <div style={{ display: "flex", alignItems: "center", marginTop:'10px' }}>
                <input
                  type="checkbox"
                  checked={doctorEmail.length === emails.length}
                  onChange={handleSelectAllChange}
                  color="primary"
                  className="customCheckbox"
                  style={{
                    width: "15px",
                    height: "15px"
                  }}
                />
                <span style={{ marginLeft: "8px" }}>ALL</span>
              </div>
            </Grid>
            <Grid item xs={12} md={4} className="customField">
              <InputLabel className="customLabel" htmlFor="subject">
                Subject <span>*</span>
              </InputLabel>
              <Field
                as={TextField}
                placeholder="Enter Subject"
                fullWidth
                id="subject"
                autoComplete="off"
                name="subject"
              />
              <ErrorMessage name="subject" component="div" className="error-text" />
            </Grid>
            <Grid item xs={12} md={4} className="customField">
              <InputLabel className="customLabel" htmlFor="description">
                Description <span>*</span>
              </InputLabel>
              <Field
                as={TextField}
                className={` ${
                  touched.description && errors.description ? "error-text" : ""
                }`}
                placeholder="Enter Description"
                id="description"
                fullWidth
                name="description"
                multiline
                rows={4}
                autoComplete="off"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="error-text"
              />
            </Grid>
            <Button
              className="buttonPrimary medium"
              variant="contained"
              fullWidth
              sx={{ maxWidth: "220px" }}
              type="submit"
              // disabled={isLoading}
               // Handle loading state during form submission
            >
              Send Notification
            </Button>
          </Paper>
        </Form>)}
      </Formik>
    </div>
  );
};

export default CreateNotification;
