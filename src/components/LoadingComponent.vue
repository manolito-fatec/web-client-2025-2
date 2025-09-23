<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="dots-container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;

}

.loading-content {
  border-radius: 8px;
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-text {
  font-family: sans-serif;
  font-size: 1.2em;
  color: #555; 
}

.dots-container {
  display: flex;
  gap: 8px;
}

.dot {
  width: 15px;
  height: 15px;
  background-color: #0f172aea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}
.dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>