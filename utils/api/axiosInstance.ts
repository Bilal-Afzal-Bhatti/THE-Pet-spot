import axios from "axios";

const getBaseUrl = () => {
  // 1. Check if we are running locally in the browser FIRST
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }

  // 2. Otherwise, use the environment variable if available
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // 3. Ultimate production fallback
  return 'https://the-pet-spot-backend.vercel.app';
};

export const API_BASE_URL = getBaseUrl();
console.log("FINAL RESOLVED BASE_URL:", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});