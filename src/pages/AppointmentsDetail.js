import { Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import DocterCard from '../components/doctor/DocterCard';
import { getAppointmentByID, getMyAppointmentByID } from '../apis/adminApis';

function AppointmentsDetail() {

    const { appid } = useParams()

    const location = useLocation();
    const data = location.state;
    const patientData = data?.patient
    const appointmentData = data
    const doctorDetails = data?.doctor
    console.log(data);

    // useEffect(async () => {

    //   const appointment= await getMyAppointmentByID(appointmentData?.appointment_id)
    //   console.log(appointment);

    // }, [appointmentData])


    return (
        <div className='patient-detail-page'>
            <Typography variant="font22" mb={4} sx={{ fontWeight: "700" }} component="h1"> Patient history </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} mb={4}>
                    <div className='custom-card' style={{ height: '100%', marginBottom: '0' }}>
                        <div className='head-wrap'>
                            <h5>Patient Information</h5>
                            <span>ID #{patientData?.patient_id}</span>
                        </div>

                        <ul>
                            <li>
                                <span>Full Name</span>
                                <p>: {patientData?.name}</p>
                            </li>
                            <li>
                                <span>Phone</span>
                                <p>: {patientData?.phone}</p>
                            </li>
                            <li>
                                <span>Email</span>
                                <p>: {patientData?.email}</p>
                            </li>
                            <li>
                                <span>Age</span>
                                <p>: {patientData?.age} </p>
                            </li>
                        </ul>

                    </div>
                </Grid>

                <Grid item xs={12} md={6} mb={4}>
                    <div className='custom-card' style={{ height: '100%', marginBottom: '0' }}>
                        <div className='head-wrap'>
                            <h5>Appointment history</h5>
                        </div>
                        {appointmentData ?
                            <ul>
                                <li>
                                    <span>No of Appointment</span>
                                    <p>: {appointmentData?.appointment_id}</p>
                                </li>
                                <li>
                                    <span>Start date</span>
                                    <p>: {new Date(appointmentData?.initial_schedule_date).toLocaleDateString()}</p>
                                </li>
                                <li>
                                    <span>Start Time</span>
                                    <p>: {new Date(appointmentData?.initial_schedule_date).toLocaleTimeString()} - {new Date(new Date(appointmentData.initial_schedule_date).getTime() + 15 * 60000).toLocaleTimeString()}</p>
                                </li>
                            </ul>
                            : ''}
                    </div>
                </Grid>
                {/* const doctorDetails=props.doctorDetails */}

                {/* {doctorDetails ? (
                    <>
                        <DocterCard doctorDetails={doctorDetails} className="" />
                    </>

                ) : (
                    <p>Loading doctor details...</p>
                )} */}
            </Grid>

            {/* <Typography variant="font22" mb={2} sx={{ fontWeight: "700" }} component="h1"> Consultations  </Typography> */}
            {/* <div style={{ marginBottom: '20px' }}>
                {consultationData != null ? consultationData.map((data) => {
                    return (<div className='custom-card' style={{ paddingBottom: '0' }}>
                        <div className='head-wrap'>
                            <h5>Prescriptions and Medical Advice</h5>
                        </div>
                        <p>{data.prescription.replace(/(<([^>]+)>)/ig, '')}</p>

                        <div className='bottom-bar'>
                            <img src={CalenderIcon} alt="Date" />
                            <span> {new Date(data.appointment.schedule_date).toDateString()}</span>
                            <span style={{ borderRight: '0' }}>{new Date(data.appointment.schedule_date).toLocaleTimeString()} - {new Date(new Date(data.appointment.schedule_date).getTime() + 15 * 60000).toLocaleTimeString()}</span>
                        </div>
                    </div>)
                }) : ''
                }
            </div> */}
            {

appointmentData?.additional_note && <>


                    {
                        <>

                            <Typography variant="font22" mb={2} sx={{ fontWeight: "700" }} component="h1"> Additional Notes or Instructions </Typography>
                            <div className="card-body">
                                <h5 className="card-title">Additional Note</h5>
                                <p className="card-text">{appointmentData?.additional_note}</p>

                            </div>
                            {/* {
                                appointmentData?.map((item, index) => {
                                    console.log(item?.treatment_undergoing)
                                    return (
                                        <>

                                            <div className="card" key={index} >
                                                <div className="card-body">
                                                    <h5 className="card-title">Additional Note</h5>
                                                    <p className="card-text">{item['additional_note']}</p>
                                                  
                                                </div>
                                            </div>

                                        </>
                                    )

                                })
                            } */}
                        </>

                    }


                </>


            }


        </div>
    )
}

export default AppointmentsDetail