import axios from "axios";

const ajax = axios.create({
    baseURL: window.config.site_url,
    withCredentials: true
})

export default ajax