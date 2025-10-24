<template>
  <div class="card-container">
    <LoadingComponent v-show="loading" />
    <div v-show="!loading" class="content-wrapper">
      <h2 class="card-title">Previsão de tickets estourarem o SLA</h2>

      <div v-if="predictionData.length > 0">
        <p class="card-subtitle">
          Previsão baseada no tickets abertos das subcategorias abaixo:
        </p>

        <ul class="prediction-list">
          <li v-for="(item, index) in predictionData" :key="index" class="prediction-item">
            <span class="subcategory-name">{{ item.name }}</span>
            <span class="prediction-percentage">{{ item.percentage }}%</span>
            <span v-if="item.isCritical" class="critical-indicator"></span>
          </li>
        </ul>
      </div>

      <div v-else class="no-data-message">
        <p>Nenhuma previsão de SLA disponível para o cliente selecionado.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { type Ref, ref } from 'vue'

export type SlaPredictionItem = {
  name: string;
  percentage: number;
  isCritical: boolean;
};

const props = defineProps<{
  predictionData: SlaPredictionItem[];
  loading: boolean;
}>()
</script>

<style scoped>
.card-container {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 15rem;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex-grow: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1E293B;
}

.card-subtitle {
  font-size: 0.9rem;
  color: #555;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.prediction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.prediction-item {
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  color: #333;
}

.prediction-item:last-child {
  border-bottom: none;
}

.subcategory-name {
  flex-grow: 1;
  font-weight: 500;
}

.prediction-percentage {
  font-weight: bold;
  margin-right: 0.5rem;
}

.critical-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef4444;
  margin-left: 0.25rem;
}

.no-data-message {
  text-align: center;
  color: #777;
  padding: 2rem 0;
}
</style>
