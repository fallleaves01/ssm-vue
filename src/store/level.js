const LEVELKEY='level'

export function getLevel(){
    return window.localStorage.getItem(LEVELKEY)
}

export function setLevel(level){
    return window.localStorage.setItem(LEVELKEY,level)
}

export function removeLevel(){
    return window.localStorage.removeItem(LEVELKEY)
  }