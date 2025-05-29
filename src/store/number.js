const NUMBERKEY='number'

export function getNumber(){
    return window.localStorage.getItem(NUMBERKEY)
}

export function setNumber(number){
    return window.localStorage.setItem(NUMBERKEY,number)
}

export function removeNumber(){
    return window.localStorage.removeItem(NUMBERKEY)
  }