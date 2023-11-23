import React, { useState, useEffect } from "react";
import {
  InputLabel,
  TextField,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  Divider
} from "@mui/material";
import FileUpload from "../FileUpload";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { addDoctorDetail, editDoctorDetail, saveEditDoctorDetail } from '../../apis/adminApis';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useLocation } from "react-router-dom";
import { Hidden } from "@mui/material";
import axios from "../../apis/axiosConfig";
import { Bars } from 'react-loader-spinner'
import Loader from "../Loader";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function getStyles(name, weekDay, theme) {
  return {
    fontWeight:
      weekDay.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddDoctor = () => {
  const [timeUnit, setTimeUnit] = useState('1');
  const theme = useTheme();
  const [weekDay, setWeekDay] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [updateRows, setUpdateRows] = useState([])

  const [availabilityRows, setAvailabilityRows] = useState([]);
  console.log(availabilityRows, 'availabilityRows', updateRows);



  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editDoctorId = queryParams.get("id");

  const [doctorData, setDoctorData] = useState(null);

  const isEditMode = !!editDoctorId;

  const handleUnitChange = (event) => {
    setTimeUnit(event.target.value);
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "salary" || name === "appointment_charges" ? parseInt(value, 10) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    specialization: "",
    medical_license: null,
    education: "",
    clinic_name: "",
    clinic_address: "",
    clinic_contact_no: "",
    start_working_hr: "",
    end_working_hr: "",
    working_days: [],
    priority: "",
    profile_image: null,
    summary: "",
    appointment_charges: "",
    salary: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    const validationErrors = {};
    if (!formData.first_name) {
      validationErrors.first_name = "First name is required";
    }
    if (!formData.last_name) {
      validationErrors.last_name = "Last name is required";
    }
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!formData.phone_number) {
      validationErrors.phone_number = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      validationErrors.phone_number = "Invalid phone number. Please enter a 10-digit phone number.";
    }
    if (formData.phone_number > 1 && formData.phone_number < 10) {
      validationErrors.phone_number = "contact number should be equal to 10 ";
    }
    if (!formData.specialization) {
      validationErrors.specialization = "specialization is required";
    }
    if (!formData.education) {
      validationErrors.education = "Education is required";
    }
    if (!formData.clinic_name) {
      validationErrors.clinic_name = "Clinic name is required";
    }
    if (!formData.clinic_address) {
      validationErrors.clinic_address = "Clinic address is required";
    }

    if (!formData.priority) {
      validationErrors.priority = "Priority is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let newFormData = new FormData();
    Object.keys(formData).forEach((value) => {
      if ((value === 'profile_image' || value === 'medical_license') && typeof formData[value] === 'string') {
        return;
      } else {
        newFormData.append(value, formData[value]);
      }
    });

    const availability = availabilityRows.map((row) => ({
      id: row.id || '',
      start_working_hr: row.start_working_hr.split(':')[0] + ':' + row.start_working_hr.split(':')[1],
      end_working_hr: row.end_working_hr.split(':')[0] + ':' + row.end_working_hr.split(':')[1],
      working_days: row.working_days.join(", "),

    }

    ));

    newFormData.append("doctor_availability", JSON.stringify(availability)); // adding the availability array
    newFormData.append("availability", JSON.stringify(availability)); // adding the availability array

    try {
      let response;
      console.log('ppppppnnn', response)
      if (isEditMode) {
        response = await saveEditDoctorDetail(newFormData);
        console.log('Edit Dtatt', response)
      } else {
        for (const [key, value] of newFormData.entries()) {
          console.log(`${key}: ${value}`);
        }
        response = await addDoctorDetail(newFormData);

      }

      if (response?.data?.status) {
        setOpenSnackbar(true);
        setSnackbarMessage(isEditMode ? "Doctor details updated successfully!" : "Doctor details saved successfully!");
        setSnackbarSeverity("success");
      } else {
        setOpenSnackbar(true);
        setSnackbarMessage(response?.data?.message || "An error occurred while saving doctor details.");
        setSnackbarSeverity("error");
      }

      // Clear the form
      if (!isEditMode) {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          specialization: "",
          medical_license: null,
          education: "",
          clinic_name: "",
          clinic_address: "",
          clinic_contact_no: "",
          start_working_hr: "",
          end_working_hr: "",
          working_days: [],
          priority: "",
          profile_image: null,
          summary: "",
          appointment_charges: "",
          salary: "",
        });
      }
    } catch (error) {
      console.error("Error saving doctor details:", error);
      setOpenSnackbar(true);
      setSnackbarMessage(error.response?.data?.message || "An error occurred while saving doctor details.");
      setSnackbarSeverity("error");
    }

  };

  useEffect(() => {
    if (isEditMode && editDoctorId) {
      setOpenSnackbar(true)

      editDoctorDetail(editDoctorId)
        .then((response) => {
          if (response.data) {
            console.log('Edit Doctor Response', response.data?.data)
            setDoctorData(response.data?.data);
            setOpenSnackbar(false)

          } else {
            setOpenSnackbar(false)

            console.error("API response is not valid:", response);
          }
        })
        .catch((error) => {
          setOpenSnackbar(false)

          console.error("Error fetching doctor details:", error);
        });
    }
  }, [isEditMode, editDoctorId, openSnackbar]);


  // Pre-fill the form fields with doctorData
  useEffect(() => {
    if (doctorData) {
      const profilePath = doctorData.user.profile_image && doctorData.user.profile_image.split("/");
      const profile_image = profilePath ? profilePath[profilePath.length - 1] : null;
      const licensePath = doctorData.medical_license && doctorData.medical_license.split("/");
      const medical_license = licensePath ? licensePath[licensePath.length - 1] : null;
      setFormData({
        id: editDoctorId,
        first_name: doctorData.user.first_name || "",
        last_name: doctorData.user.last_name || "",
        email: doctorData.user.email || "",
        phone_number: doctorData.user.phone_number || "",
        specialization: doctorData.specialization || "",
        medical_license: medical_license,
        education: doctorData.education || "",
        clinic_name: doctorData.clinic_name || "",
        clinic_address: doctorData.clinic_address || "",
        clinic_contact_no: doctorData.clinic_contact_no || "",
        start_working_hr: doctorData.doctor_availability[0] ? doctorData.doctor_availability[0].end_working_hr.split(":")[0] + ":" + doctorData.doctor_availability[0].end_working_hr.split(":")[1] || "" : '',
        end_working_hr: doctorData.doctor_availability[0] ? doctorData.doctor_availability[0].end_working_hr.split(":")[0] + ":" + doctorData.doctor_availability[0].end_working_hr.split(":")[1] || "" : '',
        working_days: doctorData.working_days || [],
        priority: doctorData.priority || "",
        profile_image: profile_image,
        summary: doctorData.summary || "",
        appointment_charges: doctorData.appointment_charges || "",
        salary: doctorData.salary || "",
      });
      setAvailabilityRows(doctorData.doctor_availability);
      setUpdateRows(doctorData.doctor_availability)
      // Set the selected working days
      setWeekDay(doctorData.working_days || []);
      // Set the selected time unit
      setTimeUnit(doctorData.time_unit || '1');
    }
  }, [doctorData, openSnackbar]);


  const addAvabilityRow = () => {
    setOpenSnackbar(true)
    const newAvailabilityRows = [...availabilityRows];
    console.log(newAvailabilityRows);
    const newRow = {

      start_working_hr: "",
      end_working_hr: "",
      working_days: [],
    };
    console.log(newRow,);
    newAvailabilityRows.push(newRow);
    setAvailabilityRows(newAvailabilityRows);
    setOpenSnackbar(false)

  };

  const handleAvabilityChange = (index, name, value) => {
    const newAvailabilityRows = [...availabilityRows];
    const updatedRow = { ...newAvailabilityRows[index], [name]: value };
    newAvailabilityRows[index] = updatedRow;
    setAvailabilityRows(newAvailabilityRows);

  };

  const removeAvailabilityRow = (index) => {
    setOpenSnackbar(true)
    if (index) {


      axios.patch(axios.defaults.baseURL + "/admin/time-remove", { "id": index }).then((res) => {
        console.log(res);
        setOpenSnackbar(false)

        // const newAvailabilityRows = [...availabilityRows];
        // newAvailabilityRows.splice(index, 1);
        // setAvailabilityRows(newAvailabilityRows);

      })
    }
    else {


      const newAvailabilityRows = [...availabilityRows];
      newAvailabilityRows.splice(-1);
      setAvailabilityRows(newAvailabilityRows);
    }


  };

  return (
    <div>

      <form className="customForm newInput" onSubmit={handleSubmit}>

        <Hidden xsUp>
          <input
            type="text"
            name="id"
            value={editDoctorId || ""}
            readOnly
          />
        </Hidden>
        <Typography
          mb={3}
          variant="font22"
          sx={{ fontWeight: "700" }}
          component="h1"
        >
          <Link className="back-btn" to='/doctor'><FontAwesomeIcon icon={faArrowLeftLong} /></Link> {isEditMode ? 'Edit Doctor' : 'Add Doctor'}
        </Typography>
        <Paper className="formMainWrap">
          <Typography
            mb={3}
            sx={{ fontWeight: "700", fontSize: "18px" }}
            component="h1"
          >
            Personal Information
          </Typography>
          <Grid container spacing={3} pb={2}>
            <Grid item xs={12} md={4}>
              <InputLabel
                className="customLabel"
                htmlFor="name"

              >
                First Name
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Firstname"
                fullWidth
                id="first_name"
                autoComplete="off"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <span className="error">{errors.first_name}</span>}
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel" htmlFor="name">
                Last Name
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Lastname"
                fullWidth
                id="last_name"
                autoComplete="off"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <span className="error">{errors.last_name}</span>}
            </Grid>

            <Grid item iopenSnackbartem xs={12} md={4}>
              <InputLabel className="customLabel" htmlFor="email">
                Email address
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Email address"
                id="email"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </Grid>

            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel" htmlFor="number">
                Contact number
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Contact Number"
                id="number"
                fullWidth
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && <span className="error">{errors.phone_number}</span>}
            </Grid>

          </Grid>

          <Divider sx={{ my: 4 }} />
          <Typography
            mb={3}
            sx={{ fontWeight: "700", fontSize: "18px" }}
            component="h1"
          >
            Professional Information
          </Typography>
          <Grid container spacing={4} pb={2}>
            <Grid item xs={12} md={4}>
              <InputLabel
                className="customLabel"
                htmlFor="specialization"
              >
                specialization
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter specialization"
                fullWidth
                id="specialization"
                autoComplete="off"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />
              {errors.specialization && <span className="error">{errors.specialization}</span>}
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel" htmlFor="medical_license">
                Medical License
              </InputLabel>
              <FileUpload
                name="medical_license"
                formData={formData}
                value={formData.medical_license}
                setFormData={setFormData}
                label="Browse"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel" htmlFor="education">
                Education
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Education"
                id="education"
                fullWidth
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
              {errors.education && <span className="error">{errors.education}</span>}
            </Grid>
          </Grid>

          {/* clinic information */}
          <Divider sx={{ my: 4 }} />
          <Typography
            mb={3}
            sx={{ fontWeight: "700", fontSize: "18px" }}
            component="h1"
          >
            Clinic or Practice Information
          </Typography>
          <Grid container spacing={4} pb={2}>
            <Grid item xs={12} md={4}>
              <InputLabel
                className="customLabel"
                htmlFor="clinic_name"
              >
                Clinic Name
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Clinic Name"
                fullWidth
                id="clinic_name"
                autoComplete="off"
                name="clinic_name"
                value={formData.clinic_name}
                onChange={handleChange}
              />
              {errors.clinic_name && <span className="error">{errors.clinic_name}</span>}
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel" htmlFor="clinic_address">
                Clinic Address
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Clinic Address"
                fullWidth
                id="clinic_address"
                autoComplete="off"
                name="clinic_address"
                value={formData.clinic_address}
                onChange={handleChange}
              />
              {errors.clinic_address && <span className="error">{errors.clinic_address}</span>}
            </Grid>

            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel" htmlFor="contactDetail">
                Clinic Contact Number
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Contact Number "
                id="contactDetail"
                fullWidth
                name="clinic_contact_no"
                value={formData.clinic_contact_no}
                onChange={handleChange}
              />
              {errors.clinic_contact_no && <span className="error">{errors.clinic_contact_no}</span>}
            </Grid>
          </Grid>


          {/* availability */}
          <Divider sx={{ my: 4 }} />
          <Typography
            mb={3}
            sx={{ fontWeight: "700", fontSize: "18px" }}
            component="h1"
          >
            Availability and Schedule
          </Typography>
          {/* <Grid className="addRowOuter" container spacing={4} pb={2}>
            <Grid item xs={12} md={4}>
              <InputLabel
                className="customLabel"
                htmlFor="hourStart"
              >
                Working hours start
              </InputLabel>
              <div className="twoInputWrap">
                <TextField
                  className="customField"
                  fullWidth
                  id="hourStart"
                  type="time"
                  autoComplete="off"
                  name="start_working_hr"
                  value={formData.start_working_hr.slice(0, 5)}
                  onChange={handleChange}
                />
                <span className="to-text">to</span>
              </div>
              {errors.start_working_hr && <span className="error">{errors.start_working_hr}</span>}
            </Grid>
            <Grid item xs={12} md={3}>
              <InputLabel
                className="customLabel"
                htmlFor="hourEnd"
              >
                Working hours end
              </InputLabel>
              <div className="twoInputWrap" style={{padding:"0"}}>
                <TextField
                  className="customField"
                  placeholder="Enter Clinic Name"
                  fullWidth
                  id="hourEnd"
                  type="time"
                  autoComplete="off"
                  name="end_working_hr"
                  value={formData.end_working_hr.slice(0, 5)}
                  onChange={handleChange}
                />
              </div>
              {errors.end_working_hr && <span className="error">{errors.end_working_hr}</span>}
            </Grid>
            <Grid item xs={12} md={4} style={{paddingRight:'20px'}}>
              <InputLabel className="customLabel">
                Working Days
              </InputLabel>
              <Select
                className="customField"
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                name="working_days"
                value={formData.working_days}
                onChange={handleChange}
                input={<OutlinedInput label="Name" />}
                MenuProps={MenuProps}
              >
                {weekDays.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, weekDay, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {errors.working_days && <span className="error">{errors.working_days}</span>}
            </Grid>
            <Grid item xs={12} md={1}>
            <div className="end-btns">
              <span onClick={addAvabilityRow} className="action-btn add"><FontAwesomeIcon icon={faPlus} /></span>
              <span className="action-btn remove"><FontAwesomeIcon icon={faMinus} /></span>
            </div>
            </Grid>
          </Grid> */}


          {availabilityRows.map((row, index) => {

            console.log();
            return (
              <>

                <Grid key={row.id} className="addRowOuter" container spacing={4} pb={2}>
                  <Grid item xs={12} md={4}>
                    <InputLabel className="customLabel" htmlFor={`hourStart-${index}`}>
                      Working hours start
                    </InputLabel>
                    <div className="twoInputWrap">
                      <TextField
                        className="customField"
                        fullWidth
                        id={`hourStart-${index}`}
                        type="time"
                        autoComplete="off"
                        name="start_working_hr"
                        value={row.start_working_hr}
                        onChange={(e) => handleAvabilityChange(index, 'start_working_hr', e.target.value)}
                      />
                      <span className="to-text">to</span>
                    </div>
                    {errors.start_working_hr && <span className="error">{errors.start_working_hr}</span>}
                    {/* {errors[`start_working_hr_${index}`] && (
                  <span className="error">{errors[`start_working_hr_${index}`]}</span>
                )} */}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <InputLabel className="customLabel" htmlFor={`hourEnd-${index}`}>
                      Working hours end
                    </InputLabel>
                    <div className="twoInputWrap" style={{ padding: '0' }}>
                      <TextField
                        className="customField"
                        placeholder="Enter Clinic Name"
                        fullWidth
                        id={`hourEnd-${index}`}
                        type="time"
                        autoComplete="off"
                        name="end_working_hr"
                        value={row.end_working_hr}
                        onChange={(e) => handleAvabilityChange(index, 'end_working_hr', e.target.value)}
                      />
                    </div>
                    {errors.end_working_hr && <span className="error">{errors.end_working_hr}</span>}
                    {/* {errors[`end_working_hr_${index}`] && (
                  <span className="error">{errors[`end_working_hr_${index}`]}</span>
                )} */}
                  </Grid>
                  <Grid item xs={12} md={4} style={{ paddingRight: '20px' }}>
                    <InputLabel className="customLabel">Working Days</InputLabel>
                    <Select
                      className="customField"
                      labelId={`demo-multiple-name-label-${index}`}
                      id={`demo-multiple-name-${index}`}
                      multiple
                      name="working_days"
                      value={row.working_days}
                      onChange={(e) => handleAvabilityChange(index, 'working_days', e.target.value)}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {weekDays.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, row.working_days, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.working_days && <span className="error">{errors.working_days}</span>}
                    {/* {errors[`working_days_${index}`] && (
                  <span className="error">{errors[`working_days_${index}`]}</span>
                )} */}
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <div className="end-btns">
                      {index === 0 ? (
                        <span onClick={addAvabilityRow} className="action-btn add">
                          <FontAwesomeIcon icon={faPlus} />
                        </span>
                      ) : (
                        <>
                          <span onClick={() => addAvabilityRow(row.id)} className="action-btn add">
                            <FontAwesomeIcon icon={faPlus} />
                          </span>
                          <span onClick={() => removeAvailabilityRow(row.id)} className="action-btn remove">
                            <FontAwesomeIcon icon={faMinus} />
                          </span>
                        </>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </>


            )
          })}


          <Grid container spacing={4} pb={2}>
            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel">
                Priority
              </InputLabel>
              <Select
                className="customField"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <MenuItem value={'high'}>High</MenuItem>
                <MenuItem value={'medium'}>Medium</MenuItem>
                <MenuItem value={'low'}>Low</MenuItem>
              </Select>
              {errors.priority && <span className="error">{errors.priority}</span>}
            </Grid>
          </Grid>


          {/* availability */}
          <Divider sx={{ my: 4 }} />
          <Typography
            mb={3}
            sx={{ fontWeight: "700", fontSize: "18px" }}
            component="h1"
          >
            Upload Information
          </Typography>
          <Grid container spacing={4} pb={2}>
            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel">
                Upload a Profile image
              </InputLabel>
              <FileUpload
                name="profile_image"
                formData={formData}
                value={formData.profile_image}
                setFormData={setFormData}
                label="Browse"
              />

            </Grid>
            <Grid item xs={12} md={8}>
              <InputLabel className="customLabel">
                Biography or Summary
              </InputLabel>
              <TextField
                className="customField"
                fullWidth
                multiline
                maxRows={4}
                name="summary"
                value={formData.summary}
                onChange={handleChange}
              />
              {errors.summary && <span className="error">{errors.summary}</span>}
            </Grid>
          </Grid>

          {/* Doctor’s Charges */}
          <Divider sx={{ my: 4 }} />
          <Typography
            mb={3}
            sx={{ fontWeight: "700", fontSize: "18px" }}
            component="h1"
          >
            Doctor’s Charges
          </Typography>
          <Grid container spacing={4} pb={2}>
            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel">
                Appointment charges
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Appointment charges"
                fullWidth
                type="number"
                name="appointment_charges"
                value={formData.appointment_charges}
                onChange={handleChange}
              />
              {errors.appointment_charges && <span className="error">{errors.appointment_charges}</span>}
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel className="customLabel">
                Salary
              </InputLabel>
              <TextField
                className="customField"
                placeholder="Enter Salary"
                fullWidth
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
              />
              {errors.salary && <span className="error">{errors.salary}</span>}
            </Grid>
          </Grid>

        </Paper>

        <Stack sx={{ alignItems: "center" }}>
          <Button
            type="submit"
            className="buttonPrimary medium"
            variant="contained"
            fullWidth
            sx={{ maxWidth: "420px" }}
          >
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </Stack>
      </form>






      <Snackbar
        open={openSnackbar}
        autoHideDuration={60}
        onClose={() => setOpenSnackbar(false)}
      >
        <div>
          <Alert
            elevation={6}
            variant="filled"
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </Alert>
        </div>
      </Snackbar>

    </div>
  );
};

export default AddDoctor;