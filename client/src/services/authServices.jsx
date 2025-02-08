// services/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(
      `${API_URL}/login`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(
      `${API_URL}/register`,
      userData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw new Error("Logout failed");
  }
};
