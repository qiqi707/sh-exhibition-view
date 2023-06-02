const BASE_URL = process.env.VUE_APP_BASE_API
const TOKEN_KEY = ''

function getBaseUrl () {
  if (process.env.VUE_APP_ENV === 'development') {
    return '/api'
  } else {
    return BASE_URL
  }
}

function getToken () {
  return localStorage.getItem(TOKEN_KEY)
}
function setToken (value) {
  localStorage.setItem(TOKEN_KEY, value)
}
function removeToken () {
  localStorage.removeItem(TOKEN_KEY)
}

export {
  getBaseUrl,
  getToken,
  setToken,
  removeToken
}
