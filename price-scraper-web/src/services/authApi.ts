import { api } from "./http.js";

export const authApi = {
  login: async (email: string, passwordRaw: string) => {
    const res = await api.post("/auth/login", { email, password: passwordRaw });
    return res.data.data; // { user, token }
  },
  register: async (name: string, email: string, passwordRaw: string) => {
    const res = await api.post("/auth/register", { name, email, password: passwordRaw });
    return res.data.data;
  },
  logout: () => {
    localStorage.removeItem("ps_auth_token");
    localStorage.removeItem("ps_user");
  }
};
