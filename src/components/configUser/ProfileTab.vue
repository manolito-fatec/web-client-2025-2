<template>
    <Card class="profile-card">
        <template #header>
            <div class="section-header">
                <div class="header-icon">
                    <i class="pi pi-user"></i>
                </div>
                <div class="header-content">
                    <h3 class="header-title">Meu Perfil</h3>
                    <p class="header-subtitle">LGPD: qualidade e atualização de dados (art. 6, V).</p>
                </div>
            </div>
        </template>

        <template #content>
            <div class="profile-form">
                <div class="form-row">
                    <div class="form-field">
                        <label for="name">Nome</label>
                        <InputText id="name" v-model="profile.name" class="w-full" />
                    </div>

                    <div class="form-field">
                        <label for="email">E-mail corporativo</label>
                        <InputText id="email" v-model="profile.email" class="w-full" />
                    </div>
                </div>

                <div class="form-actions">
                    <Button label="Salvar" icon="pi pi-check" @click="$emit('save-profile')" class="btn-primary" />
                    <Button label="Cancelar" outlined @click="$emit('cancel-changes')"
                        class="btn-outline" />
                </div>
            </div>

            <div v-if="accountClosed" class="account-closed-alert">
                Sua conta está em processo de encerramento e eliminação conforme política de retenção.
            </div>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

defineProps({
    profile: {
        type: Object,
        required: true
    },
    accountClosed: {
        type: Boolean,
        default: false
    }
})

defineEmits(['save-profile', 'cancel-changes'])
</script>

<style scoped>
.section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    padding-bottom: 46px;
    padding-left: 2rem;
}

.header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #f1f5f9;
    border-radius: 20px;
}

.header-icon i {
    display: flex;
    font-size: 20px;
    color: #000;
    padding-left: 0.1rem;
}

.header-content {
    flex: 1;
}

.header-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #0f172a;
    line-height: 1.2;
}

.header-subtitle {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: #64748b;
}

.profile-form {
    padding: 16px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-field label {
    font-size: 14px;
    font-weight: 500;
    color: #334155;
}

.form-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
}

.btn-primary {
    background-color: #0f172a !important;
    border-color: #0f172a !important;
    color: #ffffff !important;
    font-size: smaller;
    white-space: nowrap;
}

.btn-primary:hover {
    background-color: #1e293b !important;
    border-color: #1e293b !important;
}

.btn-outline {
    background-color: transparent !important;
    border: 1px solid #cbd5e1 !important;
    color: #000 !important;
    font-size: smaller;
    white-space: nowrap;
}

.btn-outline:hover {
    background-color: #f8fafc !important;
    border-color: #94a3b8 !important;
}

.account-closed-alert {
    margin-top: 16px;
    padding: 12px;
    background-color: #fee2e2;
    border: 1px solid #fca5a5;
    border-radius: 8px;
    color: #991b1b;
    font-size: 14px;
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 400px) {
    .form-actions {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>