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
  import { Link, useLocation, useParams } from "react-router-dom";
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
  import NoDataImg from '../../assets/images/no-data.png';
  import dayjs from "dayjs";
  import axios from '../../apis/axiosConfig';
  import { saveAs } from 'file-saver';
  import { editDoctorDetail, getUpcomingAppointment, getCompletedAppointment, getRescheduledAppointment, DownloadAppointmentReport } from '../../apis/adminApis';
  import DocterCard from "./DocterCard";

  const columns = [
    { id: "sno", label: "S.no.", minWidth: 40 },
    // { id: "id", label: "ID", minWidth: 40, },
    { id: "name", label: "Name", minWidth: 140 },
    { id: "age", label: "Age", minWidth: 110 },
    { id: "mobile", label: "Mobile", minWidth: 140 },
    { id: "email", label: "Email", minWidth: 110 },
    { id: "appointmentTime", label: "Appointment Time ", minWidth: 110 },
    { id: "appointementDate", label: "Appointment Date", minWidth: 110 },
  ];

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
    const [graphDetails, setGraphDetails] = useState(null);
    const [value, setValue] = useState(0);
    const [openDialog, setDetailDialog] = useState(false);
    const [upcomingAppointment, setUpcomingAppointment] = useState([]);
    const [completedAppointment, setCompletedAppointment] = useState([]);
    const [rescheduleAppointment, setRescheduleAppointment] = useState([]);
    const [chartDate, setChartDate] = useState({
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
          categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
              return "Rs " + val + " thousands"
            }
          }
        }
      },

    });
    // patient appointment chart
    const [patientchartData, setPatientchartData] = useState({
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
            return seriesName + " <br/> <span style='color: #222B45; font-weight: 600;'>₹3,004</span> ";
          },
        },
      },
    });

    const editDoctorId = useParams().doctor_id;

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
            console.log('Edit Doctor Response', response.data);
            setDoctorDetails(response.data?.data);
            setGraphDetails(response.data?.graphs)
            setChartDate({
              series: [{
                name: 'Online Sales',
                data: response.data.graphs.revenue.reduce((acc, curr) => {
                  acc.push(curr.total_paid);
                  return acc;
                }, []),
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
                  categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
                      return "₹ " + val
                    }
                  }
                }
              },

            })
          } else {
            console.error("API response is not valid:", response);
          }
          setPatientchartData({
            series: [
              {
                name: "Last Month",
                data: response.data.graphs.patient_appointment_graph.last_month.reduce((acc, curr) => {
                  acc.push(curr.count);
                  return acc;
                }, []),
              },
              {
                name: "This Month",
                data: response.data.graphs.patient_appointment_graph.current_month.reduce((acc, curr) => {
                  acc.push(curr.count);
                  return acc;
                }, []),
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
                categories: response.data.graphs.patient_appointment_graph.last_month.reduce((acc, curr) => {
                  acc.push(curr.day);
                  return acc;
                }, []),
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
                  return seriesName + " <br/> <span style='color: #222B45; font-weight: 600;'>₹3,004</span> ";
                },
              },
            },
          });
        })
        .catch((error) => {
          console.error("Error fetching doctor details:", error);
        });
      // Fetch upcoming appointments
      getUpcomingAppointment(editDoctorId)
        .then((response) => {
          if (response.data) {
            const upcomingAppointmentsData = response?.data?.data || [];
            // console.log('Upcoming appoinmenet ******', upcomingAppointmentsData)
            setUpcomingAppointment(upcomingAppointmentsData.map(appointment => {
              const scheduleDate = dayjs(appointment.schedule_date);
              return {
                ...appointment,
                date: scheduleDate.format("YYYY-MM-DD"),
                time: scheduleDate.format("HH:mm"),
              };
            }));

          } else {
            console.error("API response for upcoming appointments is not valid:", response);
          }
        })
        .catch((error) => {
          console.error("Error fetching upcoming appointments:", error);
        });

      // Fetch completed appointments
      getCompletedAppointment(editDoctorId)
        .then((response) => {
          if (response.data) {
            const completedAppointmentsData = response?.data?.data || [];
            // console.log('Upcoming appoinmenet', completedAppointmentsData)
            setCompletedAppointment(completedAppointmentsData.map(appointment => {
              const scheduleDate = dayjs(appointment.schedule_date);
              return {
                ...appointment,
                date: scheduleDate.format("YYYY-MM-DD"),
                time: scheduleDate.format("HH:mm"),
              };
            }));
          } else {
            console.error("API response for upcoming appointments is not valid:", response);
          }
        })
        .catch((error) => {
          console.error("Error fetching upcoming appointments:", error);
        });

      // Fetch reschedule appointments
      getRescheduledAppointment(editDoctorId)
        .then((response) => {
          if (response.data) {
            const rescheduledAppointmentsData = response?.data?.data || [];
            // console.log('Upcoming appoinmenet', rescheduledAppointmentsData)
            setRescheduleAppointment(rescheduledAppointmentsData.map(appointment => {
              const scheduleDate = dayjs(appointment.schedule_date);
              return {
                ...appointment,
                date: scheduleDate.format("YYYY-MM-DD"),
                time: scheduleDate.format("HH:mm"),
              };
            }));
          } else {
            console.error("API response for upcoming appointments is not valid:", response);
          }
        })
        .catch((error) => {
          console.error("Error fetching upcoming appointments:", error);
        });


    }, [editDoctorId]);


    const handleDownloadReport = () => {
      const fileName = 'Appointment-Report.xlsx';
      DownloadAppointmentReport(editDoctorId)
        .then((response) => {
          saveAs(response.data, fileName);
        })
        .catch((error) => {
          console.error("Error downloading XLSX report:", error);
        });
    };


    return (
      <div className="doc-detail-wrap">
        <Typography
          mb={3}
          variant="font22"
          sx={{ fontWeight: "700" }}
          component="h1"
        >
          {doctorDetails ?
            <span><Link className="back-btn" to='/doctor'><FontAwesomeIcon icon={faArrowLeftLong} /></Link>Dr. {doctorDetails.user.first_name} {doctorDetails.user.last_name}</span> : ''}
        </Typography>
        <Paper className="customBoxWrap">
          {doctorDetails ? (
            <>
            <DocterCard  doctorDetails={doctorDetails}/>
            </>

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
                <div className='custom-legend'>
                  <ul>
                    <li>
                      <p>Total revenue
                        <span>₹{graphDetails ? graphDetails.revenue.reduce((acc, curr) => {
                          acc += curr.total_paid;
                          return acc;
                        }, 0) : 0}</span>
                      </p>
                    </li>
                  </ul>
                </div>
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
                        <span>₹{graphDetails ? graphDetails.patient_appointment_graph.last_month.reduce((acc, curr) => {
                          return acc += curr.count;
                        }, 0) : 0}</span>
                      </p>
                    </li>

                    <li>
                      <img src={GreenIcon} alt='This Month' />
                      <p>
                        This Month
                        <span>₹{graphDetails ? graphDetails.patient_appointment_graph.current_month.reduce((acc, curr) => {
                          return acc += curr.count;
                        }, 0) : 0}</span>
                      </p>

                    </li>
                  </ul>
                </div>
              </div>
              <Stack style={{ marginTop: '40px', width: '100%' }}>
                <Button onClick={handleDownloadReport} className="buttonPrimary small" variant="contained" style={{ maxWidth: 'fit-content', margin: '0 auto' }}><img src={DownloadIcon} alt='Add Doctor' style={{ marginRight: '8px' }} /> Appointment Reports</Button>
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
              {upcomingAppointment.length > 0 ?
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
                      // console.log('Upcoming appoinmenet not showing', upcomingAppointment),
                      <TableRow
                        key={data.patient.patient_id}
                        index={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell> {index + 1} </TableCell>
                        {/* <TableCell> {data.patient.patient_id} </TableCell> */}
                        <TableCell>{data.patient.name}</TableCell>
                        <TableCell>{data.patient.age}</TableCell>
                        <TableCell>{data.patient.phone}</TableCell>
                        <TableCell>{data.patient.email}</TableCell>
                        <TableCell>{data.time}</TableCell>
                        <TableCell>{data.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                :
                <div className="no-data-wrap">
                  <img src={NoDataImg} alt="No Doctor" />
                  <h5 className="mt-0">No appointment scheduled yet!</h5>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </div>
              }
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TableContainer className="customTable">
              {completedAppointment.length > 0 ?
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
                    {completedAppointment?.map((data, index) => (
                      // console.log('completed appoinmenet not showing', completedAppointment),
                      <TableRow
                        key={data.patient.patient_id}
                        index={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell> {index + 1} </TableCell>
                        {/* <TableCell> {data.patient.patient_id} </TableCell> */}
                        <TableCell >{data.patient.name}</TableCell>
                        <TableCell>{data.patient.age}</TableCell>
                        <TableCell>{data.patient.phone}</TableCell>
                        <TableCell>{data.patient.email}</TableCell>
                        <TableCell>{data.time}</TableCell>
                        <TableCell>{data.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                :
                <div className="no-data-wrap">
                  <img src={NoDataImg} alt="No Doctor" />
                  <h5>No appointment scheduled yet!</h5>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </div>
              }
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <TableContainer className="customTable">
              {rescheduleAppointment.length > 0 ?
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
                    {rescheduleAppointment?.map((data, index) => (
                      //  console.log('reschedule appoinmenet not showing', rescheduleAppointment),
                      <TableRow
                        key={data.patient.patient_id}
                        index={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell> {index + 1} </TableCell>
                        {/* <TableCell> {data.patient.patient_id} </TableCell> */}
                        <TableCell>{data.patient.name}</TableCell>
                        <TableCell>{data.patient.age}</TableCell>
                        <TableCell>{data.patient.phone}</TableCell>
                        <TableCell>{data.patient.email}</TableCell>
                        <TableCell>{data.time}</TableCell>
                        <TableCell>{data.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                :
                <div className="no-data-wrap">
                  <img src={NoDataImg} alt="No Doctor" />
                  <h5>No appointment scheduled yet!</h5>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </div>
              }
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