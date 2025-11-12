import api from './axios/AxiosConfig';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: any;
    company?: string;
}

export interface AuditDto {
  event: string;
  user: string;
  date: string;
  locale: string;
  details: string;
}

export interface UserProfileInformation {
  appUser: UserProfile;
  auditInfomation: AuditDto[];
}

export const userService = {
/**
     * Adicione a nova função para buscar TUDO
     * Busca todas as informações (perfil + auditoria) para a tela de perfil.
     */
    async getProfileInformation(id: number): Promise<UserProfileInformation> {
        try {
            const response = await api.get<UserProfileInformation>(`/user/information/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar informações do perfil:', error);
            throw new Error('Não foi possível carregar os dados do perfil e auditoria.');
        }
    },

    /**
     * Atualiza os dados de perfil de um usuário.
     */
    async updateUser(user: UserProfile): Promise<UserProfile> {
        try {
            const response = await api.post<UserProfile>('/user', user);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw new Error('Não foi possível salvar as alterações.');
        }
    }
};