import axios from './axiosConfig';


// const api = axios.create({
//     baseURL: 'http://192.168.54.189:9000',
// });

export const logIn = ({ email, password }) => {
    return axios.post('/accounts/login', { email, password });
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