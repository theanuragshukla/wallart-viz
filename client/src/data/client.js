import axios from "axios";
const baseURL = "http://localhost:5000";

export const getClient = () => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

