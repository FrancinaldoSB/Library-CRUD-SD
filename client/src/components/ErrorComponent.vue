<template>
  <div class="error-container">
    <h2>Erro ao carregar componente</h2>
    <p>Ocorreu um problema ao tentar carregar a página.</p>
    <button @click="voltarParaInicio">Voltar ao início</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const voltarParaInicio = () => {
  router.push('/');
};
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  color: #343a40;
  padding: 20px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
