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

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      if(error?.response?.data?.code === 'token_not_valid') {
        const sessionExpiredEvent = new Event('sessionExpired');
        window.dispatchEvent(sessionExpiredEvent);
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location = '/';
        }, 2000);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;