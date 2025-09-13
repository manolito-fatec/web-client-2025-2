<script setup lang="ts">
import { ref, watch } from 'vue';
import type { SelectListOption } from '@/components/types/SelectListOption.ts';

const props = defineProps<{
  options: SelectListOption[];
  modelValue?: string | number | null;
}>();

const emit = defineEmits(['update:modelValue']);

const selectedOption = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  selectedOption.value = newValue;
  console.log(newValue);
});

function emitChange() {
  emit('update:modelValue', selectedOption.value);
}

</script>

<template>
  <div class="select-wrapper">
    <select v-model="selectedOption" @change="emitChange" class="generic-select">
      <option value="" disabled selected>Selecione uma opção</option>
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>



<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
}

.select-wrapper label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}

.generic-select {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1rem;
  color: #333;
  width: 100%;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.generic-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.generic-select option {
  padding: 0.75rem 1rem;
}
</style>
