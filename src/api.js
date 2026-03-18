import axios from 'axios'

export const API_BASE = 'http://piagent.local:8082'

export default axios.create({
  baseURL: API_BASE,
})
