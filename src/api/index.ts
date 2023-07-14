import axios from "axios";
import dotEnv from "dotenv";

dotEnv.config();

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default api;
