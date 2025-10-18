import { defineStore } from 'pinia';
import axios from 'axios';
import { fetchUserProfile } from "@/api/ProfileApi.ts";
import { setSessionItem } from '@/api/session/SessionManagement.ts'
import type { LoginData } from '@/types/LoginData.ts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem("token") || null,
    userId: sessionStorage.getItem("userId") || null,
    configHeader: {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
    }
  }),
  actions: {
    async loginAndStore(loginData: LoginData) {
      try {
        const response = await axios.post("http://localhost:8080/auth/login", {
          email: loginData.email,
          password: loginData.password
        });

        this.token = response.data.token;
        setSessionItem("token", this.token!);
        const decodedToken = JSON.parse(atob(response.data.token.split(".")[1]));
        console.log(decodedToken);
        const userId = decodedToken.userId;
        const userRole = decodedToken.role.rlName;
        setSessionItem("userId", userId);
        setSessionItem("role", userRole);
        const userProfile = await fetchUserProfile(userId);
        this.userId = userProfile.id.toString();
        this.configHeader.headers.Authorization = `Bearer ${this.token}`;
        return true;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          console.error("Access forbidden - invalid credentials");
          return false;
        }
        console.error("Login failed:", error);
        throw error;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getConfigHeader: (state) => state.configHeader
  }
});
