<script setup lang="ts">


</script>

<template>
  <div class="filters-bar">
    <div class="filter-group">
      <label>Produto</label>
      <select>
        <option>Todos</option>
      </select>
    </div>
    <div class="filter-group">
      <label>Cliente</label>
      <select>
        <option>Todos</option>
      </select>
    </div>
    <div class="filter-group">
      <label>De</label>
      <input type="date" value="2023-01-01">
    </div>
    <div class="filter-group">
      <label>Até</label>
      <input type="date" value="2023-09-30">
    </div>
    <div class="btn-group">
      <button class="btn btn-clear">Limpar</button>
      <button class="btn btn-apply">Aplicar</button>
      <button class="btn btn-export">Exportar</button>
    </div>
  </div>

</template>

<style scoped>

.filters-bar {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}


.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 1rem;
  color: var(--vt-c-black);
  margin-bottom: 0.25rem;
}

.btn-group{
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  align-self: flex-end;
}


.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-clear {
  background-color: #f4f7fa;
  font-weight: bold;
  font-size: 0.9rem;
  height: 3rem;
  margin-left: auto;
  border-radius: 6px;
  
}

.btn-apply {
  background-color: #0f172aea;
  color: #ffffff;
  font-weight: bold;
  font-size: 0.9rem;
  height: 3rem;
  border-color: #ddd;
  margin-left: auto;
  border-radius: 6px;

}


.btn-export {
  background-color: #0f172aea;
  color: #ffffff;
  font-weight: bold;
  font-size: 0.9rem;
  height: 3rem;
  border-color: #ddd;
  margin-left: auto;
  border-radius: 6px;
}

</style>
