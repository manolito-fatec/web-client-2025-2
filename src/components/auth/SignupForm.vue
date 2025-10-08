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

<style scoped></style>
