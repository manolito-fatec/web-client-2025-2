import type { UserProfile, UserProfileInformation } from '@/types/ConfigUser/UserTypes';
import api from './axios/AxiosConfig';



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
    },

    async updateRole(id: number, role: string): Promise<void>
    {
        try {
            const response = await api.post('/user/role', { id, role });
            return response.data;
        } catch (error: any) {
            console.error(`Erro ao alterar papel:`, error);
            throw new Error(
                error?.response?.status === 408
                    ? 'Tempo de resposta excedido.'
                    : error?.response?.status === 500
                    ? 'Erro interno.'
                    : 'Erro ao alterar papel.'
            );
        }
    },

    async deleteUser(id: number): Promise<void>
    {
        try
        {
            const response = await api.delete(`/user?id=${id}`);
            return response.data;
        } 
        catch (error: any) {
            console.error('Erro ao deletar usuário:', error);
            throw new Error(
                error?.response?.status === 408
                    ? 'Tempo de resposta excedido.'
                    : error?.response?.status === 500
                    ? 'Erro interno.'
                    : 'Erro ao deletar usuário.'
            );
        }
    }
};