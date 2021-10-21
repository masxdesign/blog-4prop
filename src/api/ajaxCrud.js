import axios from "axios";

const ajaxCrud = axios.create({
    baseURL: 'https://localhost:50443/api/crud',
    withCredentials: true
})

export default ajaxCrud