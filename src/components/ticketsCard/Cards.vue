<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

const props = defineProps<{
title: String;
value: String;
}>();

const titleRef: Ref<String> = ref<String>("");
const valueRef: Ref<String> = ref<String>("");

onMounted(() => {
titleRef.value = props.title;
valueRef.value = props.value;

});
</script>
<template>
    <div class="metric-card">
        <h3>{{ titleRef }}</h3>
        <span>{{ valueRef}}</span>
    </div>
</template>
<style scoped>
.metric-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.metric-card h3 {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.metric-card span {
  font-size: 2.5rem;
  font-weight: bold;
}
</style>