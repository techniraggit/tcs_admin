import React, { useState } from 'react';
import { Button, Typography, Grid, FormControl, Paper } from '@mui/material';
import '../assets/scss/dashboard.scss';
import Chart from 'react-apexcharts';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DummyDoctorImg from '../assets/images/dummy-doctor.svg';
import { useNavigate } from 'react-router-dom';
import DoctorImg from '../assets/images/doctor.svg';
import PatientImg from '../assets/images/dash-patient.svg';
import DocumentImg from '../assets/images/document-text.svg';
import Exporticon from '../assets/images/export-icon.svg';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CalendarImg from '../assets/images/dash-calendar.svg';
import BlueIcon from '../assets/images/blue-icon.svg';
import GreenIcon from '../assets/images/green-icon.svg';
import { Snackbar, Alert } from "@mui/material";

const Dashboard = () => {
  const [value, setValue] = React.useState(1);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // show error msg
  const [successSnackbar, setSuccessSnackbar] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    <div className='dashboard-outer'>
      <Typography variant="font22" mb={4} sx={{ fontWeight: "700" }} component="h1"> Dashboard </Typography>

      <Grid container>
        <Grid item xs={12} md={7}>
          <Paper className="customBoxWrap">
            <div className="head-wrap" style={{ padding: "0", alignItems: 'flex-start' }}>
              <div>
                <Typography
                  sx={{ fontWeight: "700", fontSize: "20px" }}
                  component="h1"
                >
                  Today’s analatics
                </Typography>
                <div className='date-drodown'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker value="{13 July 2023}" />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>

              <Button className='export-btn' title='Export'> <img src={Exporticon} alt="Export" style={{ paddingRight: '8px' }} /> Export</Button>
            </div>
            <ul className='cards-row'>
              <li>
                <div className='card-box blue'>
                  <img src={DoctorImg} alt='Total Sales' />
                  <Typography variant='font24' mt={2} sx={{ fontWeight: '700' }} component="h1">$1k</Typography>
                  <Typography variant='font16' sx={{ fontWeight: '500', color: '#425166' }} component="p">Total doctors</Typography>
                  <span>2 doctors added</span>
                </div>
              </li>
              <li>
                <div className='card-box red'>
                  <img src={PatientImg} alt='Total Sales' />
                  <Typography variant='font24' mt={2} sx={{ fontWeight: '700' }} component="h1">300</Typography>
                  <Typography variant='font16' sx={{ fontWeight: '500', color: '#425166' }} component="p">Total Patient </Typography>
                  <span>+5% from yesterday</span>
                </div>
              </li>
              <li>
                <div className='card-box green'>
                  <img src={DocumentImg} alt='Total Sales' />
                  <Typography variant='font24' mt={2} sx={{ fontWeight: '700' }} component="h1">15</Typography>
                  <Typography variant='font16' sx={{ fontWeight: '500', color: '#425166' }} component="p">Total appointment</Typography>
                  <span>+1,2% from yesterday</span>
                </div>
              </li>
            </ul>
          </Paper>
          <div className='revenue-chart'>
            <Paper className="customBoxWrap">
              <div className="head-wrap" style={{ padding: "0" }}>
                <Typography sx={{ fontWeight: '700', fontSize: '20px' }} component="h1">Total Revenue</Typography>
                <div className='date-drodown'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div>
                <Chart
                  options={chartDate.options}
                  series={chartDate.series}
                  type="bar"
                  width="100%"
                />
              </div>
            </Paper>
          </div>
        </Grid>
        <Grid item xs={12} md={5} pl={3} >
          <div className='retailer-box'>
            <Paper className="customBoxWrap">
              <div className='head-wrap' style={{ padding: '0' }}>
                <Typography sx={{ fontWeight: '700', fontSize: '16px' }} component="h1">New doctor's Added</Typography>
                <FormControl className='sale-select'>
                  <Select
                    labelId="demo-simple-select-label"
                    placeholder='Select Option'
                    value={value}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>Last Month</MenuItem>
                    <MenuItem value={2}>Last Year</MenuItem>
                    <MenuItem value={3}>2020 Year</MenuItem>
                    <MenuItem value={4}>2019 Year</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <ul className='doctor-list'>
                <li>
                  <div className='img-wrap'>
                    <img src={DummyDoctorImg} alt='' />
                  </div>
                  <div className='text-wrap'>
                    <h6>Dr. Jerome Bell</h6>
                    <p>Ut enim ad minima veniam, quis nostrum exercitati</p>
                  </div>
                </li>
                <li>
                  <div className='img-wrap'>
                    <img src={DummyDoctorImg} alt='' />
                  </div>
                  <div className='text-wrap'>
                    <h6>Dr. Jerome Bell</h6>
                    <p>Ut enim ad minima veniam, quis nostrum exercitati</p>
                  </div>
                </li>
                <li>
                  <div className='img-wrap'>
                    <img src={DummyDoctorImg} alt='' />
                  </div>
                  <div className='text-wrap'>
                    <h6>Dr. Jerome Bell</h6>
                    <p>Ut enim ad minima veniam, quis nostrum exercitati</p>
                  </div>
                </li>
                <li>
                  <div className='img-wrap'>
                    <img src={DummyDoctorImg} alt='' />
                  </div>
                  <div className='text-wrap'>
                    <h6>Dr. Jerome Bell</h6>
                    <p>Ut enim ad minima veniam, quis nostrum exercitati</p>
                  </div>
                </li>
              </ul>
              <Button
                className="buttonPrimary medium"
                variant="contained"
                fullWidth
                sx={{ fontSize: '15px' }}
              // onClick={() => navigate("/retailer")}
              >
                Show All
              </Button>
            </Paper>
          </div>


          <div className="sale-chart">
            <div className="head-wrap" style={{ padding: '20px 20px 0' }}>
              <Typography
                sx={{ fontWeight: "700", fontSize: "20px" }}
                component="h1"
              >
                Patient Appointment
              </Typography>
            </div>
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
          </div>
        </Grid>
      </Grid>

      <Snackbar
        open={successSnackbar}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbar(false)}
      >
        <Alert onClose={() => setSuccessSnackbar(false)} severity="success">
          {successSnackbar}
        </Alert>
      </Snackbar>

    </div>
  )
}

export default Dashboard