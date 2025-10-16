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
            text plain
            :class="['nav-item', {'active': currentRouteName === 'dashboard'}]"
            @click="navigate('dashboard')"
          />
          <Button
            label="Insights"
            text plain
            :class="['nav-item', {'active': currentRouteName === 'insights'}]"
            @click="navigate('insights')"
          />
          <Button
            label="Chamados"
            text plain
            :class="['nav-item', {'active': currentRouteName === 'chamados'}]"
            @click="navigate('chamados')"
          />
          <Button
            label="Admin"
            text plain
            :class="['nav-item', {'active': currentRouteName === 'admin'}]"
            @click="navigate('admin')"
          />
        </nav>
      </div>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const currentRouteName = computed(() => route.name);

const navigate = (routeName: string) => {
  if (currentRouteName.value !== routeName) {
    router.push({ name: routeName });
  }
}

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
  gap: 1rem;
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
</style>
