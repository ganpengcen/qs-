import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
// const reTokenKey = 'Refresh-Token'

export function getToken() {
  return localStorage.getItem('token');
}
export function getRefreshToken() {
  return localStorage.getItem('Refresh-Token');
}

export function setToken(token) {
  //return Cookies.set(TokenKey, token)
  return  localStorage.setItem('token',token);
}

export function setRefreshToken(rToken) {
  return  localStorage.setItem('Refresh-Token',rToken);
}

export function removeToken() {
  return localStorage.removeItem('token')
}

export function removePermissionList() {
  return localStorage.removeItem('Permission-List')
}



