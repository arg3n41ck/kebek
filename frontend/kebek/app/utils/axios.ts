import axios from 'axios'
import { API_URL } from './constants'

const $api = axios.create({
    baseURL: API_URL || process.env.NEXT_PUBLIC_API_URL,
})

$api.interceptors.request.use((config:any)=>{
    const token = window.localStorage.getItem('token')
    if(token){
        return {
            ...config,
            headers: {
                "Authorization": `Token ${token}`
            }
        }
    }
    return config;
}, function (error:any) {
    // Do something with request error
    return Promise.reject(error);
})

export default $api
