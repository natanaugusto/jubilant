import axios from 'axios';

console.log(API_URL)

export default axios.create({
  baseURL: API_URL
})