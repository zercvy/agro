import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
})

// Поддержка токена
export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Token ${token}`
  } else {
    delete API.defaults.headers.common['Authorization']
  }
}

export default API
