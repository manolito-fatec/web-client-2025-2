<template>
  <div class="admin-container">
    <NavigationBar />
    <UsersTable/>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/navigationBar/NavigationBar.vue'
import UsersTable from '@/components/UsersTable/UsersTable.vue'

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
