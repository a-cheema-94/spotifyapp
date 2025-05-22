import axios from "axios";

axios.defaults.withCredentials = true;
// ensures axios requests send cookies.

const BASE_URL = window.location.href.includes('127.0.0.1')
  ? 'http://127.0.0.1:5000'
  : 'VERCEL_URL';

export default axios.create({
  baseURL: BASE_URL,
});
