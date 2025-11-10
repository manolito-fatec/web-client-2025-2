<template>
    <header class="topbar">
        <div class="topbar-content">

            <div class="topbar-left">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-lg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>

                <span class="logo-text">LGPD Center</span>

                <span class="badge badge-secondary">Wireframe (mínimo LGPD)</span>
            </div>

            <div class="user-menu" ref="userMenuRef">
                <button @click="toggleDropdown" class="user-icon-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>
                <div v-if="isDropdownOpen" class="dropdown-content">
                    <router-link :to="{ name: 'dashboard' }" class="config-button" @click="configHandler">
                        Home
                    </router-link>
                    <button @click="logoutHandler" class="logout-button">Logout</button>
                </div>
            </div>

        </div>
    </header>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { authService } from '@/api/AuthService.ts'

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

const mockUser = {
    id: "usr_42",
    email: "carlos.eduardo@cliente.com.br",
    tenant: "cliente-sa",
};


function maskEmail(email: string): string {
    return email.replace(/(^.).+(@)/, (_, a, b) => `${a}***${b}`);
}
</script>

<style scoped>
.topbar {
    --color-border: #e5e7eb;
    --color-text-muted: #64748b;
    --color-text-default: #0f172a;
    --color-badge-secondary-bg: #f1f5f9;
    --color-badge-secondary-text: #000;

    position: sticky;
    top: 0;
    z-index: 30;
    backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.75);
    border-bottom: 1px solid var(--color-border);

    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}


.topbar-content {
    margin-left: auto;
    margin-right: auto;
    max-width: 1280px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.topbar-left,
.topbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo-text {
    font-weight: 600;
    color: var(--color-text-default);
}

.badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.625rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
}

.badge-secondary {
    background-color: var(--color-badge-secondary-bg);
    color: var(--color-badge-secondary-text);
    border: 1px solid transparent;
}

.badge-outline {
    background-color: #ffffff;
    border: 1px solid var(--color-border);
    color: var(--color-text-default);
}

.icon {
    stroke-width: 2px;
    stroke: currentColor;
    fill: none;
}

.icon-lg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-text-default);
}

.icon-sm {
    width: 1rem;
    height: 1.75rem;
}

.user-info {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    display: none;
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

.user-menu {
    position: relative;
}

@media (min-width: 768px) {
    .user-info {
        display: flex;
    }
}
</style>