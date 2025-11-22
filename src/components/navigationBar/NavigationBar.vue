<template>
  <Toolbar class="navigation-toolbar">
    <template #start>
      <div class="vertical-container">
        <div class="p-toolbar-title">
          <h1>Pardal - Análise de Chamados</h1>
        </div>
        <nav class="navigation">
          <Button
            label="Dashboard"
            text
            plain
            :class="['nav-item', { active: currentRouteName === 'dashboard' }]"
            @click="navigate('dashboard')"
          />
          <Button
            label="Insights"
            text
            plain
            :class="['nav-item', { active: currentRouteName === 'insights' }]"
            @click="navigate('insights')"
          />
          <Button
            label="Admin"
            text
            plain
            :class="['nav-item', { active: currentRouteName === 'admin' }]"
            @click="navigate('admin')"
            v-if="isAdmin"
          />
        </nav>
      </div>
    </template>

    <template #end>
      <div class="user-menu" ref="userMenuRef">
        <button @click="toggleDropdown" class="user-icon-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        <div v-if="isDropdownOpen" class="dropdown-content">
          <router-link :to="{ name: 'user-config' }" class="config-button" @click="configHandler">
            Perfil do Usuário
          </router-link>
          <button @click="logoutHandler" class="logout-button">Logout</button>
        </div>
      </div>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { authService } from '@/api/AuthService.ts'
import { getSessionItem } from '@/api/session/SessionManagement.ts'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const currentRouteName = computed(() => route.name)

const navigate = (routeName: string) => {
  if (currentRouteName.value !== routeName) {
    switch(routeName) {
      case 'admin':
        if (userRoleValidate('Admin')) {
          router.push({ name: routeName })
          break
        } else {
          toast.add({
            severity: 'error',
            summary: 'Acesso negado',
            detail: 'Somente administradores podem entrar nesta tela!',
            life: 3000
          })
          break
        }
      default:
        router.push({ name: routeName })
    }
  }
}

const userRole = computed(() => {
    const role = sessionStorage.getItem('role'); 
    return role ? role.toLowerCase() : null;
});

const isAdmin = computed(() => {
  return userRole.value === 'admin';
});

const logoutHandler = () => {
  authService.logout()
  isDropdownOpen.value = false
}

const configHandler = () => {
  isDropdownOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

const isDropdownOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

function userRoleValidate(role: string):boolean {
  return getSessionItem('role') == role
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navigation-toolbar {
  background-color: #fff;
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.vertical-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.p-toolbar-title h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #333;
  font-weight: bold;
}

.navigation {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0;
}

.nav-item {
  font-weight: bold;
  color: #999;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease-in-out;
}

.nav-item:hover {
  color: #000;
  background-color: transparent;
}

.nav-item.active {
  color: #000;
  border-bottom: 2px solid #3b82f6;
}

.user-menu {
  position: relative;
}

.user-icon-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: background-color 0.2s;
}

.user-icon-button:hover {
  background-color: #e0e0e0;
}

.dropdown-content {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 100;
  min-width: 140px;
}

.logout-button {
  background-color: transparent;
  border: none;
  color: #d9534f;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

.logout-button:hover {
  background-color: #fef2f2;
}

.config-button {
  display: block;
  text-decoration: none;
  background-color: transparent;
  border: none;
  color: #555;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

.config-button:hover {
  background-color: #fef2f2;
}
</style>
