//声明一个常量,利于保护
const TOKENKEY='token'
//获取token
export function getToken(){
  return window.localStorage.getItem(TOKENKEY)
}
//设置token
export function setToken(token){
  return window.localStorage.setItem(TOKENKEY,token)
}
//删除
export function removeToken(){
  return window.localStorage.removeItem(TOKENKEY)
}