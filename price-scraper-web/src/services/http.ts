import axios, { type InternalAxiosRequestConfig } from "axios";

// Usa VITE_API_URL em produção (Docker build arg) e localhost em dev local
const BASE_URL =
  (import.meta.env as unknown as { VITE_API_URL?: string })?.VITE_API_URL ??
  "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Injeta token JWT automaticamente em todas as requisições autenticadas
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("ps_auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
