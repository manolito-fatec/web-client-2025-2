<template>
  <div class="admin-container">
    <NavigationBar />
    <UsersTable/>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/navigationBar/NavigationBar.vue'
import { onMounted, ref, type Ref } from 'vue'
import UsersTable from '@/components/UsersTable/UsersTable.vue'
import type { AppUserTable } from '@/types/ObjectTypes/AppUserTable.ts'
import { getUserTableData } from '@/components/UsersTable/UserTableUtils.ts'

const appUsers: Ref<AppUserTable[]> = ref<AppUserTable[]>([])

</script>

<style scoped>
html {
  overflow: hidden;
}

.admin-container {
  font-family: Arial, sans-serif;
  padding: 2rem;
  background-color: #f7f9fc;
  color: #333;
}
</style>
