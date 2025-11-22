<template>
  <div class="filter-item" ref="target">
    <label v-if="label" :for="id" class="filter-label">{{ label }}</label>

    <div
      class="p-multiselect"
      :class="{ 'p-focus': isOpen }"
      @click="toggleDropdown"
    >
      <div class="p-multiselect-label-container">
        <div class="p-multiselect-label" :class="{ 'p-placeholder': !modelValue.length }">
          {{ displayLabel }}
        </div>
      </div>
      <div class="p-multiselect-trigger">
        <span class="custom-chevron"></span>
      </div>

      <div v-show="isOpen" class="p-multiselect-panel">
        <div class="p-multiselect-items-wrapper">
          <ul class="p-multiselect-items">
            <li
              class="p-multiselect-item"
              :class="{ 'p-highlight': isAllSelected }"
              @click.stop="toggleAll"
            >
              <div class="p-checkbox">
                <div class="p-checkbox-box" :class="{ 'p-highlight': isAllSelected }"></div>
              </div>
              <span class="option-text">Todos</span>
            </li>

            <li
              v-for="option in options"
              :key="option.code"
              class="p-multiselect-item"
              :class="{ 'p-highlight': isSelected(option) }"
              @click.stop="toggleOption(option)"
            >
              <div class="p-checkbox">
                <div class="p-checkbox-box" :class="{ 'p-highlight': isSelected(option) }"></div>
              </div>
              <span class="option-text">{{ option.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { FilterCompany } from '@/types/Company.ts'

const props = defineProps<{
  id: string
  label?: string
  modelValue: FilterCompany[]
  options: FilterCompany[]
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterCompany[]): void
}>()

const isOpen = ref(false)
const target = ref<HTMLElement | null>(null)

const isSelected = (option: FilterCompany) => {
  return props.modelValue.some((item) => item.code === option.code)
}

const isAllSelected = computed(() => {
  return props.options.length > 0 && props.modelValue.length === props.options.length
})

const displayLabel = computed(() => {
  if (props.modelValue.length === 0) {
    return props.placeholder || 'Selecione...'
  }
  if (props.modelValue.length === props.options.length) {
    return 'Todos'
  }
  if (props.modelValue.length === 1) {
    return props.modelValue[0].name
  }
  return `${props.modelValue.length} itens selecionados`
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const toggleOption = (option: FilterCompany) => {
  const newSelection = [...props.modelValue]
  const index = newSelection.findIndex((item) => item.code === option.code)

  if (index === -1) {
    newSelection.push(option)
  } else {
    newSelection.splice(index, 1)
  }
  emit('update:modelValue', newSelection)
}

const toggleAll = () => {
  if (isAllSelected.value) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', [...props.options])
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (target.value && !target.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.filter-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.filter-label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.p-multiselect {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  min-height: 40px;
}

.p-multiselect:hover {
  border-color: #cccccc;
}

.p-multiselect.p-focus {
  outline: 0 none;
  border-color: #0f76b9;
  box-shadow: 0 0 0 1px #0f76b9;
}

.p-multiselect-label-container {
  flex: 1 1 auto;
  overflow: hidden;
}

.p-multiselect-label {
  padding: 0.5rem 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 1rem;
  color: #495057;
}

.p-multiselect-label.p-placeholder {
  color: #6c757d;
}

.p-multiselect-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.357rem;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.custom-chevron {
  border-style: solid;
  border-color: #6c757d;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  vertical-align: middle;
  margin-top: -2px;
}

.p-multiselect-panel {
  background: #ffffff;
  color: #495057;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1000;
  margin-top: 2px;
  padding: 0.25rem 0;
}

.p-multiselect-items-wrapper {
  max-height: 200px;
  overflow: auto;
}

.p-multiselect-items {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.p-multiselect-item {
  cursor: pointer;
  font-weight: 400;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 1rem;
  color: #333;
}

.p-multiselect-item:hover {
  background-color: #e9ecef;
}

.p-checkbox {
  display: inline-flex;
  cursor: pointer;
  user-select: none;
  vertical-align: bottom;
  position: relative;
  margin-right: 0.5rem;
}

.p-checkbox-box {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #e0e0e0;
  background: #ffffff;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  transition: background-color 0.2s, border-color 0.2s;
}

.p-checkbox-box.p-highlight {
  border-color: #333;
  background: #333;
}

.option-text {
  margin-left: 4px;
}
</style>
