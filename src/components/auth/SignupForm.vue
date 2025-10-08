<script setup lang="ts">
</script>

<template>
  <div class="signup-form">
    <p class="info-text">
      Digite seu e-mail corporativo com domínio <strong>@pardal</strong> para receber o link de confirmação.
    </p>
    <div class="field">
      <label>E-mail</label>
      <input placeholder="seunome@pardal.com" />
      <span class="error-text">Erro aqui</span>
    </div>
    <button class="btn primary">Enviar link</button>
    <button class="btn secondary">Cancelar</button>
    <p class="hint">Um e-mail será enviado com link válido por 24h.</p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.field label {
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: #6b7280;
}

.field input {
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  padding: 0 0.75rem;
  outline: none;
  transition: box-shadow 0.2s;
}

.field input:focus {
  box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.4);
}
</style>
