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
          <button class="action-button" @click="fetchBooks">Ver todos os livros</button>
          <button class="action-button">Adicionar novo livro</button>
        </div>
      </div>
    </main>

    <div class="books-container">
      <!-- Mensagem de carregamento -->
      <div v-if="loading" class="loading-message">
        Carregando livros...
      </div>
      
      <!-- Mensagem de erro -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <!-- Lista de livros -->
      <div v-if="!loading && !error && books.length === 0" class="no-books-message">
        Nenhum livro cadastrado. Adicione um novo livro para começar.
      </div>
      
      <div v-if="!loading && books.length > 0" class="books-list">
        <div v-for="book in books" :key="book.id" class="book-card">
          <div class="book-image">
            <img 
              :src="book.image_url || 'https://via.placeholder.com/150x200?text=Sem+Imagem'" 
              :alt="book.title"
            />
          </div>
          <div class="book-details">
            <h3>{{ book.title }}</h3>
            <p><strong>Autor:</strong> {{ book.author }}</p>
            <p><strong>Páginas:</strong> {{ book.number_of_pages }}</p>
            <p><strong>Ano:</strong> {{ book.year_of_publication }}</p>
          </div>
          <div class="book-actions">
            <button @click="editBook(book.id)">Editar</button>
            <button @click="deleteBook(book.id)">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService, BookService } from '@/services/api';

const router = useRouter();
const books = ref([]);
const loading = ref(false);
const error = ref(null);

// Buscar todos os livros
const fetchBooks = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await BookService.getAllBooks();
    books.value = response.data;
  } catch (err) {
    console.error('Erro ao buscar livros:', err);
    error.value = 'Não foi possível carregar os livros. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

// Carregar livros quando o componente for montado
onMounted(() => {
  fetchBooks();
});

// Editar livro
const editBook = (id) => {
  // Implementação futura: navegação para página de edição
  console.log('Editar livro com ID:', id);
};

// Excluir livro
const deleteBook = async (id) => {
  if (confirm('Tem certeza que deseja excluir este livro?')) {
    try {
      await BookService.deleteBook(id);
      // Recarregar a lista após exclusão
      fetchBooks();
    } catch (err) {
      console.error('Erro ao excluir livro:', err);
      alert('Não foi possível excluir o livro. Por favor, tente novamente.');
    }
  }
};

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
/* Removido conforme solicitado */
</style>