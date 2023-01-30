import axios from "axios"
import { BASE_URL } from "./constants"

const instance = axios.create({
    baseURL: BASE_URL
})

instance.interceptors.request.use(config => {

    const token = localStorage.getItem("token")

    if (token) {

        config.url = `${config.url}${config.url.includes("?") ? `&token=${token}` : `?token=${token}`}`
    }

    if(config.method === "post" && config.data) {

        const payload = new FormData()

        Object.keys(config.data).forEach(key => {

            payload.append(key, config.data[key])
        })

        config.data = payload
    }

    console.log(config);
    return config
})

// instance.interceptors.response.use(response => response, error => {
//     if (error.response?.status === 401) {
//         localStorage.removeItem("jwtToken")
//         window.location.href = "/login"
//     }
//     return Promise.reject(error)
// })

export default instance