import axios from 'axios';

const api = axios.create({
    baseURL: 'https://recipe-aoi.onrender.com/api', // Point to your Backend
});

export default api;