<script setup lang="ts">
import type { ProductInsight } from '../types/InsightType/Insight';
import { defineProps, ref, computed, watch } from 'vue';

const props = defineProps<{
  insights: ProductInsight[]
}>();

const currentPage = ref(1);
const itemsPerPage = ref(2);

const totalPages = computed(() => {
  if (!props.insights) return 0;
  return Math.ceil(props.insights.length / itemsPerPage.value);
});

const paginatedInsights = computed(() => {
  if (!props.insights) return [];
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return props.insights.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

watch(() => props.insights, () => {
  currentPage.value = 1;
});

</script>

<template>
  <section class="insight-card-section">

    <div class="insight-card-title">
      Insights de Produto (Sugestões em Chamados)
    </div>

    <section class="insight-card-body">
      
      <ul v-if="paginatedInsights && paginatedInsights.length > 0" class="insight-card-list">
        <li v-for="product in paginatedInsights" :key="product.id" class="insight-card-item">
          <div class="product-title">
            <strong>{{ product.productName }}</strong>
          </div>
          <ul class="themes-list">
            <li v-for="theme in product.insights" :key="theme.theme">
              <div class="theme-line">
                <em>{{ theme.theme }}</em>
                <span class="insight-card-percentage"> ({{ theme.percentage }})</span>
              </div>
              <span class="insight-card-action">
                <strong>Ação sugerida:</strong> {{ theme.actions[0] }}
              </span>
            </li>
          </ul>
        </li>
      </ul>

      <div v-else-if="!props.insights || props.insights.length === 0">
        <p>Nenhum insight de produto disponível no momento.</p>
      </div>

      <div class="pagination-controls-discreet" v-if="totalPages > 1">
        <span class="page-info">Página {{ currentPage }} / {{ totalPages }}</span>
        <button @click="prevPage" :disabled="currentPage === 1" class="btn-page-arrow" title="Anterior">
          &lt;
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-page-arrow" title="Próxima">
          &gt;
        </button>
      </div>

    </section>

  </section>
</template>

<style scoped>
@import './InsightCard.css';

.product-title {
  font-size: 16px;
  margin-bottom: 0.5rem;
}

.themes-list {
  list-style-type: none;
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.themes-list li+li {
  margin-top: 0.75rem;
}

.theme-line {
  font-weight: 500;
}

/* --- ALTERAÇÕES DE ESTILO --- */

/* 1. REMOVIDO: .card-header-with-pagination (Não existe mais) */

/* 2. ESTILO DA PAGINAÇÃO RESTAURADO (com borda e margem) */
.pagination-controls-discreet {
  display: flex;
  justify-content: flex-end; /* Alinha os botões e texto à direita */
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  /* Adicionando de volta a borda e o espaçamento */
  padding-top: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid #eee; /* Linha divisória */
}

/* ... (Estilos .page-info e .btn-page-arrow sem alteração) ... */
.page-info {
  color: #555;
  font-weight: 500;
  margin-right: 0.5rem;
}

.btn-page-arrow {
  background-color: transparent;
  border: 1px solid #ccc;
  color: #3b82f6;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background-color 0.2s, color 0.2s;
}

.btn-page-arrow:hover:not(:disabled) {
  background-color: #f0f5ff;
  border-color: #3b82f6;
}

.btn-page-arrow:disabled {
  color: #aaa;
  border-color: #eee;
  cursor: not-allowed;
  background-color: #f9f9f9;
}
</style>
