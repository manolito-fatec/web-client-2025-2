<script setup lang="ts">
import { Card } from 'primevue'
import './DataCard.css'

const props = defineProps<{
  title: string
  value?: number | string
}>()
</script>

<template>
  <Card class="metric-card">
    <template #title>{{props.title}}</template>
    <template #content>
      <span>{{ props.value }}</span>
    </template>
  </Card>
</template>

<style scoped></style>
