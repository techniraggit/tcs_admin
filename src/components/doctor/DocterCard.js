import React from 'react'
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import axios from 'axios'

function DocterCard(props) {
    const doctorDetails = props.doctorDetails
    console.log(doctorDetails);

    let images = 'https://teleconsultation.niraginfotech.info/'
    return (
        <Grid container spacing={0} pb={2}>
            <Grid item xs={12} md={4}>
                <div className="doc-profile">
                    <span>
                        <img src={`${images}${doctorDetails?.user.profile_image}`} alt="Doctor" />
                    </span>
                    <h4>Dr. {doctorDetails?.user.first_name} {doctorDetails?.user.last_name}</h4>
                    <p>{doctorDetails?.specialization}</p>
                </div>

                <Grid container pb={2}>
                    <Grid item xs={12} md={6} className="item-wrap">
                        <h6>Email</h6>
                        <p>{doctorDetails?.user.email}</p>
                    </Grid>
                    <Grid item xs={12} md={6} className="item-wrap">
                        <h6>Phone</h6>
                        <p>{doctorDetails?.user.phone_number}</p>
                    </Grid>
                </Grid>

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
                    <Grid container pb={2} className="top-detail">
                        <Grid item xs={12} md={4} className="item-wrap">
                            <h6>Specialisation</h6>
                            <p>{doctorDetails?.specialization}</p>
                        </Grid>
                        <Grid item xs={12} md={4} className="item-wrap">
                            <h6>Medical License</h6>
                            <a href={`${axios.defaults.baseURL}${doctorDetails?.medical_license}`} target="_blank">Click to view</a>
                        </Grid>
                        <Grid item xs={12} md={4} className="item-wrap">
                            <h6>Education</h6>
                            <p>{doctorDetails?.education}</p>
                        </Grid>
                        <Grid item xs={12} md={4} className="item-wrap">
                            <h6>Clinic Name</h6>
                            <p>{doctorDetails?.clinic_name}</p>
                        </Grid>
                        <Grid item xs={12} md={4} className="item-wrap">
                            <h6>Clinic  Address </h6>
                            <p>{doctorDetails?.clinic_address}</p>
                        </Grid>
                        <Grid item xs={12} md={4} className="item-wrap">
                            <h6>Clinic Detail</h6>
                            <p>{doctorDetails?.clinic_contact_no}</p>
                        </Grid>
                        <Grid item xs={12} md={4} className="item-wrap" style={{ border: '0' }}>
                            <h6>Appointment charges</h6>
                            <p>{doctorDetails?.appointment_charges}</p>
                        </Grid>
                        <Grid item xs={12} md={4} className="item-wrap" style={{ border: '0' }}>
                            <h6>Salary</h6>
                            <p>{doctorDetails?.salary}</p>
                        </Grid>



                        {/* <Stack style={{ marginTop: '40px', width: '100%' }}>
          <Button className="buttonPrimary small" variant="contained" style={{ maxWidth: 'fit-content', margin: '0 auto' }}><img src={DownloadIcon} alt='Add Doctor' style={{ marginRight: '8px' }} /> Salary and Payment Reports</Button>
        </Stack> */}

                    </Grid>

                    <div className="avilability-wrap">
                        <TableContainer className="customTable" container={Paper} >
                            {doctorDetails?.doctor_availability.length > 0 ?
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Working hours start
                                            </TableCell>
                                            <TableCell>
                                                Working hours end
                                            </TableCell>
                                            <TableCell
                                            >
                                                Working  days
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {doctorDetails?.doctor_availability?.map((data, index) => (
                                            // console.log('Upcoming appoinmenet not showing', upcomingAppointment),                          
                                            <TableRow
                                                key={data.id}
                                                index={index}
                                            >
                                                <TableCell><p>
                                                    {data.start_working_hr} </p></TableCell>
                                                <TableCell><p>
                                                    {data.end_working_hr}</p></TableCell>
                                                <TableCell><p>
                                                    {data.working_days.join()}</p></TableCell>

                                                {/* <TableCell>{data.patient.phone}</TableCell> */}

                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                                :
                                <div className="no-data-wrap">
                                    {/* <img src={NoDataImg} alt="No Doctor" /> */}
                                    <h5 className="mt-0">No appointment scheduled yet!</h5>
                                    <p>Lorem ipsum dolor sit amet consectetur.</p>
                                </div>
                            }
                        </TableContainer>
                    </div>

                </div>

            </Grid>
        </Grid>
    )
}

export default DocterCard