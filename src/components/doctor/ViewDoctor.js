import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import DownloadIcon from '../../assets/images/download.svg';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppointmentDetailDialog from "./AppointmentDetailDialog";
import BlueIcon from '../../assets/images/blue-icon.svg';
import GreenIcon from '../../assets/images/green-icon.svg';
import NoDoctorImg from '../../assets/images/no-doctor.svg';
import { editDoctorDetail, getUpcomingAppointment } from '../../apis/adminApis';

const columns = [
  { id: "sno", label: "S.no.", minWidth: 40 },
  { id: "id", label: "ID", minWidth: 40, },
  { id: "name", label: "Name", minWidth: 140 },
  { id: "age", label: "Age", minWidth: 110 },
  { id: "mobile", label: "Mobile", minWidth: 140 },
  { id: "email", label: "Email", minWidth: 110 },
  { id: "appointmentTime", label: "Appointment Time ", minWidth: 110 },
  { id: "appointementDate", label: "Appointment Date", minWidth: 110 },
];
function createData(sno, id, name, age, mobile, email, appointmentTime, appointementDate) {
  return { sno, id, name, age, mobile, email, appointmentTime, appointementDate };
}
const rows = [
  createData('1', '#896759476', "Wade Warren", "25", "(225) 555-0118", "bill.sanders@example.com", "11:00 AM", "27 July 2023"),
  createData('1', '#896759476', "Wade Warren", "25", "(225) 555-0118", "bill.sanders@example.com", "11:00 AM", "27 July 2023"),
  createData('1', '#896759476', "Wade Warren", "25", "(225) 555-0118", "bill.sanders@example.com", "11:00 AM", "27 July 2023"),
  createData('1', '#896759476', "Wade Warren", "25", "(225) 555-0118", "bill.sanders@example.com", "11:00 AM", "27 July 2023"),
]

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ViewDoctor = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [value, setValue] = useState(0);
  const [openDialog, setDetailDialog] = useState(false);
  const [upcomingAppointment, setUpcomingAppointment] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editDoctorId = queryParams.get("id");

  const handleOpenDialog = () => {
    setDetailDialog(true);
  }

  const handleCloseDialog = () => {
    setDetailDialog(false);
  }

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    // Check if it's in edit mode and editDoctorId is available
    editDoctorDetail(editDoctorId)
      .then((response) => {
        if (response.data) {
          // console.log('Edit Doctor Response', response.data?.data)
          setDoctorDetails(response.data?.data);
        } else {
          console.error("API response is not valid:", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching doctor details:", error);
      });
  
    // Fetch upcoming appointments
    getUpcomingAppointment(editDoctorId)
      .then((response) => {
        if (response.data) {
          const upcomingAppointmentsData = response?.data?.data || [];
          console.log('Upcoming appoinmenet', upcomingAppointmentsData)
          setUpcomingAppointment(upcomingAppointmentsData);
        } else {
          console.error("API response for upcoming appointments is not valid:", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching upcoming appointments:", error);
      });
  }, [editDoctorId]);
  
  

  // total revenue
  const [chartDate] = useState({
    series: [{
      name: 'Online Sales',
      data: [44, 55, 57, 56, 61, 58, 63],
      colors: ['#0095FF']
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday', 'Sunday'],
      },
      yaxis: {
        title: {
          // text: '$ (thousands)'
        },
      },

      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#00E096", "#6078ea", "#0095FF"],
          stops: [0, 100],
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
        }
      }
    },

  });

  // patient appointment chart
  const [patientchartData] = useState({
    series: [
      {
        name: "Last Month",
        data: [80, 70, 64, 75, 50, 109, 100],
      },
      {
        name: "This Month",
        data: [11, 20, 28, 32, 16, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: [4],
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },

      legend: {
        show: false,
        position: 'bottom',
        horizontalAlign: 'center',
        markers: {
          // width: 16,
          // height: 16,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 10,
        },
        onItemClick: {
          toggleDataSeries: true,
        },
        formatter: function (seriesName, opts) {
          return seriesName + " <br/> <span style='color: #222B45; font-weight: 600;'>$3,004</span> ";
        },
      },
    },
  });



  return (
    <div className="doc-detail-wrap">
      <Typography
        mb={3}
        variant="font22"
        sx={{ fontWeight: "700" }}
        component="h1"
      >
        <Link className="back-btn" to='/doctor'><FontAwesomeIcon icon={faArrowLeftLong} /></Link>Dr. Courtney Henry
      </Typography>
      <Paper className="customBoxWrap">
        {doctorDetails ? (
          <Grid container spacing={0} pb={2}>
            <Grid item xs={12} md={4}>
              <div className="doc-profile">
                <span>
                  {/* <img src={DoctorImg} alt="Doctor" /> */}
                  <img src={doctorDetails.user.profile_image} alt="Doctor" />
                </span>
                <h4>Dr. Courtney Henry</h4>
                <p>Optometrist</p>
              </div>

              <Grid container pb={2}>
                <Grid item xs={12} md={6} className="item-wrap">
                  <h6>Email</h6>
                  <p>{doctorDetails.user.email}</p>
                </Grid>
                <Grid item xs={12} md={6} className="item-wrap">
                  <h6>Phone</h6>
                  <p>{doctorDetails.user.phone_number}</p>
                </Grid>
              </Grid>

              <Typography
                mb={1}
                sx={{ fontWeight: "600", fontSize: "16px", color: '#222B45' }}
                component="h1"
              >
                Other Details
              </Typography>
              <Typography
                mb={3}
                sx={{ fontWeight: "400", fontSize: "14px", color: '#6B779A' }}
                component="p"
              >
                {doctorDetails.summary}
              </Typography>

            </Grid>
            <Grid item xs={12} md={8}>
              <Typography
                mb={3}
                sx={{ fontWeight: "500", fontSize: "18px", paddingLeft: '30px' }}
                component="h1"
              >
                Other Details
              </Typography>
              <div className="view-detail">
                <Grid container pb={2}>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Specialisation</h6>
                    <p>{doctorDetails.specialization}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Medical License</h6>
                    <p>{doctorDetails.medical_license}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Education</h6>
                    <p>{doctorDetails.education}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Clinic Name</h6>
                    <p>{doctorDetails.clinic_name}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Clinic  Address </h6>
                    <p>{doctorDetails.clinic_address}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Clinic Detail</h6>
                    <p>{doctorDetails.clinic_contact_no}</p>
                  </Grid>

                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Working hours start</h6>
                    <p>{doctorDetails.start_working_hr}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Working hours end</h6>
                    <p>{doctorDetails.end_working_hr}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>day off</h6>
                    <p>{doctorDetails.working_days}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Appointment charges</h6>
                    <p>{doctorDetails.appointment_charges}</p>
                  </Grid>
                  <Grid item xs={12} md={4} className="item-wrap">
                    <h6>Salary</h6>
                    <p>{doctorDetails.salary}</p>
                  </Grid>

                  {/* <Stack style={{ marginTop: '40px', width: '100%' }}>
                    <Button className="buttonPrimary small" variant="contained" style={{ maxWidth: 'fit-content', margin: '0 auto' }}><img src={DownloadIcon} alt='Add Doctor' style={{ marginRight: '8px' }} /> Salary and Payment Reports</Button>
                  </Stack> */}

                </Grid>
              </div>

            </Grid>
          </Grid>
        ) : (
          <p>Loading doctor details...</p>
        )}
      </Paper>

      <Paper className="customBoxWrap">
        <Grid container spacing={2} pb={2}>
          <Grid item xs={12} md={7}>
            <Typography sx={{ fontWeight: '700', fontSize: '20px' }} component="h1">Total Revenue</Typography>
            <div>
              <Chart
                options={chartDate.options}
                series={chartDate.series}
                type="bar"
                width="100%"
              />
            </div>
            {/* <Stack style={{ marginTop: '40px', width: '100%' }}>
              <Button className="buttonPrimary small" variant="contained" style={{ maxWidth: 'fit-content', margin: '0 auto' }}><img src={DownloadIcon} alt='Add Doctor' style={{ marginRight: '8px' }} /> Financial Reports</Button>
            </Stack> */}
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography
              sx={{ fontWeight: "700", fontSize: "20px" }}
              component="h1"
            >
              Patient Appointment
            </Typography>

            <div>
              <Chart
                options={patientchartData.options}
                series={patientchartData.series}
                type="area"
                width="100%"
              />

              <div className='custom-legend'>
                <ul>
                  <li>
                    <img src={BlueIcon} alt='Last Month' />
                    <p>Last Month
                      <span>$3,004</span>
                    </p>
                  </li>

                  <li>
                    <img src={GreenIcon} alt='This Month' />
                    <p>
                      This Month
                      <span>$4,504</span>
                    </p>

                  </li>
                </ul>
              </div>
            </div>
            <Stack style={{ marginTop: '40px', width: '100%' }}>
              <Button onClick={handleOpenDialog} className="buttonPrimary small" variant="contained" style={{ maxWidth: 'fit-content', margin: '0 auto' }}><img src={DownloadIcon} alt='Add Doctor' style={{ marginRight: '8px' }} /> Appointment Reports</Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* bottom table tabs */}
      <Box className="tab-outer">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Upcoming" {...a11yProps(0)} />
            <Tab label="Completed" {...a11yProps(1)} />
            <Tab label="Rescheduled" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <TableContainer className="customTable">
            {/* {upcomingAppointment.length > 0 ?  */}
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                
                {upcomingAppointment?.map((data, index) => (
                   console.log('Upcoming appoinmenet not showing', upcomingAppointment),
                  <TableRow
                    key={data.patient.patient_id}
                    index={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell> {index + 1} </TableCell>
                    <TableCell> {data.patient.patient_id} </TableCell>
                    <TableCell>{data.patient.name}</TableCell>
                    <TableCell>{data.patient.age}</TableCell>
                    <TableCell>{data.patient.phone}</TableCell>
                    <TableCell>{data.patient.email}</TableCell>
                    <TableCell>{data.patient.appointmentTime}</TableCell>
                    <TableCell>{data.patient.appointementDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              {/* :
              <div className="no-doc-list" style={{ display: 'none' }}>
                <img src={NoDoctorImg} alt="No Doctor" />
                <h5>No doctor added yet</h5>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            } */}
          </TableContainer>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TableContainer className="customTable">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell> {row.sno} </TableCell>
                    <TableCell> {row.id} </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.appointmentTime}</TableCell>
                    <TableCell>{row.appointementDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <TableContainer className="customTable">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell> {row.sno} </TableCell>
                    <TableCell> {row.id} </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.appointmentTime}</TableCell>
                    <TableCell>{row.appointementDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
      </Box>

      {openDialog && (
        <AppointmentDetailDialog open={openDialog} onClose={handleCloseDialog} />
      )}
    </div>
  )
}

export default ViewDoctor