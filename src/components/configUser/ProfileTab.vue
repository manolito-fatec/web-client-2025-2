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
                    <Button label="Salvar" icon="pi pi-check" @click="handleSave" class="btn-primary" />

                    <Button label="Cancelar" outlined @click="$emit('cancel-changes')" class="btn-outline"
                        type="button" />
                </div>
            </div>

        </template>
    </Card>
</template>

<script setup lang="ts">
import './ProfileTab.css'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
    profile: {
        type: Object,
        required: true
    },
    accountClosed: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['save-profile', 'cancel-changes'])

const handleSave = () => {
    if (!props.profile.name || !props.profile.email) {

        toast.add({
            severity: 'error',
            summary: 'Campos obrigatórios',
            detail: 'Por favor, preencha os campos vazios.',
            life: 3000
        })

        return;
    }

    emit('save-profile')
}

</script>
