<template>
  <div class="dashboard-container">
    <header class="header">
      <div class="logo">
        <img src="@/assets/arara.png" alt="Arararquivos Logo" class="logo-img" />
        <h1>Arararquivos</h1>
      </div>
      <div class="user-actions">
        <span class="welcome-message">Bem-vindo!</span>
        <button @click="handleLogout" class="logout-button">Sair</button>
      </div>
    </header>
    
    <main class="main-content">
      <h1>Dashboard</h1>
      <p>Você está logado com sucesso!</p>
      
      <div class="actions">
        <h2>Gerenciamento de Livros</h2>
        <div class="action-buttons">
          <button class="action-button">Ver todos os livros</button>
          <button class="action-button">Adicionar novo livro</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/api';

const router = useRouter();

const handleLogout = async () => {
  try {
    await AuthService.logout();
    localStorage.removeItem('token');
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    // Mesmo com erro, remover token e redirecionar
    localStorage.removeItem('token');
    router.push('/');
  }
};
</script>

<style scoped>
/* Sem estilos específicos conforme solicitado */
</style>