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

<script setup lang="ts">
import './ProfileTab.css'
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
