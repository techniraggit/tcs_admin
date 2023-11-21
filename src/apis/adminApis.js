import axios from './axiosConfig';


export const logIn = ({ email, password }) => {
    return axios.post('/accounts/login', { email, password });
}

export const logOut = () => {
    return axios.get('/accounts/logout');
}

export const addPaymentPrice = (data) => {
    return axios.post('/admin/user_payment_price', data);
}


export const getPaymentPrice = () => {
    return axios.get('/admin/user_payment_price');
}



export const addDoctorDetail = (data) => {
    return axios.post('/admin/doctor', data);
}

export const doctorStatus = (id) => {
    return axios.put(`/admin/doctor?id=${id}`);
}

export const editDoctorDetail = (id) => {
    return axios.get(`/admin/doctor?id=${id}`);
}

export const saveEditDoctorDetail = (data) => {
    return axios.patch('/admin/doctor', data);
}

export const doctorlisting = () => {
    return axios.get('/admin/doctor');
}

export const isLoggedIn = () => {
    return !!localStorage.getItem('token');
}

export const getNotificationType = () => {
    return axios.get('/admin/get_push_notification_types');
}

export const getDoctorsEmails = () => {
    return axios.get('/admin/get_all_doctors_email');
}

export const  createNotification = (data) => {
    return axios.post('admin/push-notification', data);
}

export const getNotificationListing = () => {
    return axios.get('admin/push-notification')
}
export const getAppointmentByID = (id) => {
    return axios.get(`admin/appointment?appointment_id=${id}`)
}

export const getMyAppointmentByID = (id) => {
    return axios.get(`admin/my_appointments=${id}`)
}

export const getUpcomingAppointment = (id) => {
    return axios.get(`admin/appointment?search_query=pending&id=${id}`)
}

export const getCompletedAppointment = (id) => {
    return axios.get(`admin/appointment?search_query=completed&id=${id}`)
}

export const getRescheduledAppointment = (id) => {
    return axios.get(`admin/appointment?search_query=rescheduled&id=${id}`)
}

export const DownloadAppointmentReport = (id) => {
    return axios.get(`admin/download-report?action=appointment_report&doctor_id=${id}`, { responseType: 'blob' })
}

export const AppointmentListing = () => {
    return axios.get('/admin/appointment-list')
}

export const DownloadSalaryReport =(id) => {
    return axios.get(`admin/download-report?action=salary_and_payment_report&doctor_ids=${id}`, { responseType: 'blob' })
}

export const AppointmentTimeSlot =(date) => {
    return axios.get(`user/time_slots?date=${date}`)
} 

export const saveRescheduleAppointment = (data) => {
    return axios.patch('/doctor/reschedule_meeting', data);
}

export const saveCancelAppointment = (data) => {
    return axios.patch('/admin/cancel-meeting', data);
}