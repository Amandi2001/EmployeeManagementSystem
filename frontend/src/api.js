import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090/api/v1",
  // You can add common headers or interceptors here
});

export default api;
