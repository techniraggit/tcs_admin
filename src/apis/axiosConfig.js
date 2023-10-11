import { default as Axios } from 'axios';

const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (config.url.includes('doctor/time_slots') || config.url.includes('doctor/reschedule_meeting')) {
      const STATIC_TOKEN = "QzECldEQkWZDHTzGa4V7uhCqshJRRHmcQlgWWvXkBkqMG";
      config.headers['Authorization'] = `Token ${STATIC_TOKEN}`;
    } else if(token) {
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