import axios from "axios";

const ajaxCrud = axios.create({
    baseURL: `${window.config.site_url}/api/crud`,
    withCredentials: true
})

export default ajaxCrud