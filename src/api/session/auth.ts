import { defineStore } from "pinia";
import axios from "axios";
import { fetchUserProfile } from "@/api/ProfileApi.ts";
import { delSessionItem, setSessionItem } from "@/api/session/SessionManagement.ts";
import type { LoginData } from "@/types/LoginData.ts";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem("token") || null,
    userId: sessionStorage.getItem("userId") || null,
    configHeader: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    },
  }),

  actions: {
    /**
     * Realiza o login, armazena o token e atualiza os dados do usuário.
     */
    async loginAndStore(loginData: LoginData): Promise<number> {
      try {
        const response = await axios.post("http://localhost:8080/auth/login", {
          email: loginData.email,
          password: loginData.password,
        });

        const { token } = response.data;
        this.token = token;

        ["token", "userId", "role"].forEach(delSessionItem);
        setSessionItem("token", token);

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.userId;
        const userRole = decodedToken.role?.rlName || "";

        setSessionItem("userId", userId);
        setSessionItem("role", userRole);

        this.configHeader.headers.Authorization = `Bearer ${token}`;

        const userProfile = await fetchUserProfile(userId);
        this.userId = userProfile.id.toString();


        return 200;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;

          switch (status) {
            case 400:
              return 400;
            case 401:
              return 401;
            case 403:
              return 403;
            case 404:
              return 404;
            case 500:
              return 500;
            default:
              console.error(`Erro inesperado (${status}) — ${error.message}`);
              return status;
          }
        }

        console.error("Erro de rede ou requisição desconhecida:", error);
        return 0;
      }
    },



    /**
     * Realiza o logout limpando o estado e o sessionStorage.
     */
    async logout(): Promise<boolean> {
      try {
        this.token = null;
        this.userId = null;
        this.configHeader.headers.Authorization = "";

        ["token", "userId", "role"].forEach((key) => sessionStorage.removeItem(key));

        return true;
      } catch (error) {

        console.error("Erro ao fazer logout:", error);
        throw error;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    getConfigHeader: (state) => state.configHeader,
  },
});
