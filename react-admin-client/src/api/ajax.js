// 二次封装ajax
import axios from "axios"
import { message } from "antd"
//aixou的拦截器
axios.interceptors.request.use((config)=>{
    return config

},(err)=>{
    return Promise.reject(err)
})

axios.interceptors.response.use((response)=>{
    return response.data
},(err)=>{
    return Promise.reject(err)
})



export default (url,data={},type='GET')=>{
    return new Promise((resolve,reject)=>{
        let promise 
        if(type==='GET'){
            promise = axios.get(url,{params:data})
        }else{
            promise = axios.post(url,data)
        }
        promise.then((response)=>{
            resolve(response)
        }).catch(err=>{
            message.error('请求出错：'+err.message)
        })
    })
}