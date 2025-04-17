import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // ✅ Ensure this is correct
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
