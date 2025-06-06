/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import QS from 'qs';
import router from '../router/index'
import {getToken, removeToken, setToken} from '@/store/token'


//  let protocol = window.location.protocol; //协议
//  let host = window.location.host; //主机
//  axios.defaults.baseURL = protocol + "//" + host;

// 创建 axios 实例
const http = axios.create({
    baseURL: "/api", // url = base url + request url
    timeout: 10000, // request timeout
})

http.interceptors.request.use( //响应拦截，也即发送请求前做的事
    async config => {
        // 每次发送请求之前判断是否存在token
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        console.log(config);
        /*if(config.headers['isJS']==="1"){
            console.log("good is JS");
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        }
        else{
            console.log("bad not JS");
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
            multipart/form-data
        }*/
        console.log(config.headers['Content-Type'])
        if(config.headers['Content-Type']==null){
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        }
        console.log(config.headers['Content-Type'])
        config.headers['token'] = getToken() || '';
        //传输文件添加
        if(config.responseType){
            config.responseType = 'blob'
          }
        return config;
    },
    error => {
        // 对请求错误做什么
        return Promise.error(error);
    })

// 响应拦截器
http.interceptors.response.use(
    // 这里可以根据不同status来设置不同操作
    response => {
        if (response.status === 200) {
            // 若正确返回，顺便携带token信息
            
            return Promise.resolve(response); //进行中
        } else {
            return Promise.reject(response); //失败
        }
    },
    // 服务器状态码不是200的情况
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 206：伪造Token，同403
                case 206:
                    removeToken();
                    router.push('/loginPage');
                    break;
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    break;
                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                    removeToken();
                    router.push('/loginPage');
                    break;
                // 404请求不存在
                case 404:
                    break;
                // 其他错误，直接抛出错误提示
                default:
            }
            return Promise.reject(error.response);
        }
    }
);

export default http
