import api from './axios/AxiosConfig';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: any; 
}

export const userService = {
    /**
     * Busca os dados de um usuário pelo ID.
     */
    async getUserById(id: number): Promise<UserProfile> {
        try {
            const response = await api.get<UserProfile>(`/user/id/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw new Error('Não foi possível carregar os dados do usuário.');
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