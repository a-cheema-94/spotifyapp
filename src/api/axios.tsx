import axios from "axios";

axios.defaults.withCredentials = true;
// ensures axios requests send cookies.

export default axios.create({
  baseURL: "http://127.0.0.1:5000",
});
