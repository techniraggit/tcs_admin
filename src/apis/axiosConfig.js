import { default as Axios } from 'axios';

const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if(token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
});


export default axios;