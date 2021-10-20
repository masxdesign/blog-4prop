import axios from "axios";

const ajax = axios.create({
    baseURL: 'https://localhost:50443',
    withCredentials: true
})

export default ajax