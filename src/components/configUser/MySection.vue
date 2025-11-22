<template>
    <div class="user-portal">
        <Toast ref="toastRef" />

        <Tabs v-model:value="activeTab">
            <TabList>
                <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
                    <span>{{ tab.label }}</span>
                </Tab>
            </TabList>

            <TabPanels>
                <TabPanel value="0">
                    <ProfileTab :profile="profile" :account-closed="accountClosed" @save-profile="saveProfile"
                        @cancel-changes="cancelChanges" />
                </TabPanel>

                <TabPanel value="1">
                    <PrivacyTab :profile="profile" :user="profile" @export-csv="exportCSV"
                        @request-delete="showDeleteDialog = true" />
                </TabPanel>

                <TabPanel value="2">
                    <SecurityTab :profile="profile" />
                </TabPanel>

                <TabPanel value="3">
                    <AuditTab :audit-data="audit" @export-audit="exportAudit" />
                </TabPanel>
            </TabPanels>
        </Tabs>

        <Dialog v-model:visible="showDeleteDialog" header="Confirmar solicitação" :modal="true" class="delete-dialog">
            <p class="dialog-description">
                LGPD: art. 18 (eliminação) com retenções residuais justificadas.
            </p>
            <p class="dialog-message">
                Deseja prosseguir? Você perderá o acesso imediatamente.
            </p>

            <template #footer>
                <Button label="Cancelar" outlined @click="closeDeleteDialog" class="btn-cancel" />
                <Button label="Confirmar" icon="pi pi-check" @click="handleDelete" class="btn-check" />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { userService } from '@/api/UserService'

import ProfileTab from './ProfileTab.vue'
import PrivacyTab from './PrivacyTab.vue'
import SecurityTab from './SecurityTab.vue'
import AuditTab from './AuditTab.vue'
import type { AuditDto, UserProfile } from '@/types/ConfigUser/UserTypes'
import api from '@/api/axios/AxiosConfig.ts'
import { authService } from '@/api/AuthService.ts'
import router from '@/router'
import { exportAuditCsv } from '@/api/ExportApi'

const toast = useToast()
const toastRef = ref(null)
const activeTab = ref('0')

const tabs = [
    { value: '0', label: 'Meu Perfil' },
    { value: '1', label: 'Privacidade' },
    { value: '2', label: 'Segurança' },
    { value: '3', label: 'Auditoria' }
]

const profile = reactive<UserProfile>({
    id: 0,
    name: '',
    email: '',
    company: '',
    role: { id: 0, rlName: '' },
})

const originalProfile = { ...profile }
const showDeleteDialog = ref(false)
const accountClosed = ref(false)

const audit = ref<AuditDto[]>([])

onMounted(async () => {
    try {
        const userIdStr = sessionStorage.getItem('userId');
        if (!userIdStr) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'ID do usuário não encontrado na sessão.', life: 3000 });
            return;
        }

        const userId = parseInt(userIdStr, 10);

        const infoData = await userService.getProfileInformation(userId);

        if (infoData.appUser) {
            Object.assign(profile, infoData.appUser);
            Object.assign(originalProfile, infoData.appUser);
        }

        audit.value = infoData.auditInfomation || [];

        console.log("Logs carregados:", audit.value);

    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Erro ao carregar', detail: 'Não foi possível carregar os dados do perfil.', life: 3000 });
    }
})

function nowStr() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function csvString(rows: (string | number)[][]) {
    return rows
        .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
        .join('\n')
}

function addAudit(evento: string, detalhe: string) {
    const entry: AuditDto = {
        event: evento,
        details: detalhe,
        user: profile.email,
        date: nowStr(),
        locale: 'app'
    }
    audit.value = [entry, ...audit.value]
}

async function saveProfile() {
    try {
        const updatedUser = await userService.updateUser(profile);

        Object.assign(originalProfile, updatedUser);
        Object.assign(profile, updatedUser);

        addAudit('Perfil atualizado', 'Correção de dados');
        toast.add({
            severity: 'success',
            summary: 'Perfil atualizado',
            detail: 'Seus dados foram salvos com sucesso.',
            life: 3000
        });

    } catch (error) {
        console.error(error);
        toast.add({
            severity: 'error',
            summary: 'Erro ao salvar',
            detail: 'Não foi possível salvar as alterações.',
            life: 3000
        });
    }
}

function cancelChanges() {
    Object.assign(profile, originalProfile)
    toast.add({
        severity: 'info',
        summary: 'Alterações descartadas',
        life: 3000
    })
}

function exportCSV() {
    const rows = [
        ['campo', 'valor'],
        ['nome', profile.name],
        ['email', profile.email],
        ['papel', profile.role]
    ]
    const csv = csvString(rows)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portabilidade_${profile.id}.csv`
    a.click()
    URL.revokeObjectURL(url)

    addAudit('Portabilidade (CSV)', 'Export CSV executada')
    toast.add({
        severity: 'success',
        summary: 'Exportação concluída',
        detail: 'Dados pessoais exportados (CSV)',
        life: 3000
    })
}

const exportAudit = async () => {
    const userRole = sessionStorage.getItem('role');
    const userEmail = profile.email;
    console.log("ROLE ->", userRole)
    console.log("EMAIL ->", userEmail)
    if (!userRole || !userEmail) {
        toast.add({
            severity: 'warn',
            summary: 'Ação Bloqueada',
            detail: 'Dados de usuário incompletos.',
            life: 3000
        });
        return;
    }
    try {
        await exportAuditCsv(userEmail, userRole);

        toast.add({
            severity: 'success',
            summary: 'Auditoria exportada',
            detail: 'O arquivo .zip deve começar a baixar em breve.',
            life: 3000
        });

    } catch (error) {
        console.error('Falha na exportação do Audit Log:', error);
        toast.add({
            severity: 'error',
            summary: 'Erro na Exportação',
            detail: 'Não foi possível exportar o Audit Log. Tente novamente.',
            life: 5000
        });
    }
}

function resetPassword() {
    toast.add({
        severity: 'info',
        summary: 'Link enviado',
        detail: 'E-mail para redefinição de senha',
        life: 3000
    })
}

function closeDeleteDialog() {
    showDeleteDialog.value = false
}

function handleDelete() {
    accountClosed.value = true
    showDeleteDialog.value = false
    addAudit('Solicitação de eliminação', 'Encerramento de conta')
    api
      .delete('user?id=' + sessionStorage.getItem('userId'))
      .then((response) => {
        switch (response.status) {
          case 200:
            toast.add({ severity: 'success', summary: 'Usuário deletado!', life: 3000 })
            authService.logout();
            router.push('/');
            break
          case 408:
            toast.add({ severity: 'error', summary: 'Tempo de resposta excedido.', life: 3000 })
            break
          case 500:
            toast.add({ severity: 'error', summary: 'Erro interno.', life: 3000 })
            break
        }
      })
      .catch(() => {
        toast.add({ severity: 'error', summary: 'Erro ao deletar usuário.', life: 3000 })
      })
}
</script>

<style scoped>
.user-portal {
    width: 100%;
}

.user-portal :deep(.p-tabs) {
    width: 100%;
}

.user-portal :deep(.p-tablist) {
    display: grid !important;
    gap: 0;
    background: #f1f5f9;
    border: none;
    padding: 4px;
    margin-bottom: 16px;
    width: 100%;
    overflow: visible !important;
    flex-wrap: nowrap !important;
    border-radius: 8px;
}

.user-portal :deep(.p-tablist-nav-container) {
    overflow: visible !important;
    width: 100%;
}

.user-portal :deep(.p-tablist-content) {
    overflow: visible !important;
    width: 100%;
}

.user-portal :deep(.p-tablist-tab-list) {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 0;
    width: 100%;
}

.user-portal :deep(.p-tablist-prev-button),
.user-portal :deep(.p-tablist-next-button) {
    display: none !important;
}

.user-portal :deep(.p-tablist-active-bar) {
    display: none;
}

.user-portal :deep(.p-tab) {
    background: transparent;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    text-align: center;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-shrink: 0;
    margin: 2px;
}

.user-portal :deep(.p-tab:hover) {
    background: rgba(255, 255, 255, 0.5);
    color: #475569;
}

.user-portal :deep(.p-tab[data-p-active="true"]) {
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-portal :deep(.p-tabpanels) {
    background: transparent;
    padding: 0;
    width: 100%;
}

.user-portal :deep(.p-tabpanel) {
    display: none;
}

.user-portal :deep(.p-tabpanel[data-p-active="true"]) {
    display: block;
}

@media (max-width: 768px) {

    .user-portal :deep(.p-tablist),
    .user-portal :deep(.p-tablist-tab-list) {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

.delete-dialog {
    max-width: 500px;
}

.dialog-description {
    margin-bottom: 12px;
    font-size: 14px;
    color: #64748b;
}

.dialog-message {
    font-size: 14px;
    color: #334155;
}

.delete-dialog .btn-cancel {
    background-color: transparent !important;
    border: 1px solid #cbd5e1 !important;
    color: #475569 !important;
    font-size: 14px !important;
    white-space: nowrap;
}

.delete-dialog .btn-cancel:hover {
    background-color: #f8fafc !important;
    border-color: #94a3b8 !important;
}

.delete-dialog .btn-check {
    background-color: #0f172a !important;
    border-color: #0f172a !important;
    font-size: 14px !important;
    white-space: nowrap;
}

.delete-dialog .btn-check:hover {
    background-color: #1e293b !important;
    border-color: #1e293b !important;
}
</style>
