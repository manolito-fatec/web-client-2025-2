<template>
    <div class="app-layout">
        <Topbar :email="user.email" :tenant="user.tenant" />

        <div class="main-content-area">
            <TransparencySidebar />
            <div class="user-portal-area">
                <!-- <MySection />  -->
            </div>
        </div>
        
        <div class="app-footer">
            © 2025 Sua Empresa — LGPD Center
        </div>
    </div>
</template>

<script setup lang="ts">
import Topbar from '@/components/configUser/Topbar.vue';
import TransparencySidebar from '@/components/configUser/TransparencySidebar.vue';
// import MySection from '@/components/configUser/MySection.vue';

const user = {
    email: "carlos.eduardo@cliente.com.br",
    tenant: "cliente-sa"
}
</script>

<style scoped>
.app-layout {
    min-height: 100vh;
    background-color: #f8fafc;
    color: #0f172a;
}

.main-content-area {
    margin-left: auto;
    margin-right: auto;
    max-width: 1280px;
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    align-items: start;
}

@media (min-width: 1024px) {
    .main-content-area {
        grid-template-columns: 1fr 2fr;
    }
}

.user-portal-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.placeholder {
    padding: 2rem;
    border: 2px dashed #cbd5e1;
    background-color: #f1f5f9;
    border-radius: 0.5rem;
    text-align: center;
    color: #64748b;
}

.app-footer {
    border-top: 1px solid #e5e7eb;
    padding: 1.5rem 1rem;
    font-size: 0.75rem;
    color: #64748b;
    text-align: center;
    margin-top: 2rem;
}
</style>
