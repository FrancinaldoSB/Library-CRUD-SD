<template>
  <div class="homebook-root">
    <!-- Cabeçalho -->
    <header class="header">
      <div class="header-content">
        <img src="@/assets/arara.png" alt="Logo Arara" class="logo-arara" />
        <nav class="nav-menu">
          <button class="nav-btn" @click="abrirModalCadastro">Cadastrar</button>
          <button class="nav-btn logout-btn" @click="handleLogout">Sair</button>
        </nav>
      </div>
    </header>

    <!-- Apresentação -->
    <section class="apresentacao-container">
      <div class="efeito-bg"></div>
      <div class="apresentacao-content">
        <span class="apresentacao-text">Pegue uma cadeira, e se acomode na literatura.</span>
      </div>
    </section>

    <!-- Barra de pesquisa -->
    <section class="pesquisa-container">
      <div class="pesquisa-box">
        <input 
          type="text" 
          v-model="termoPesquisa" 
          placeholder="Pesquisar por título, autor ou ano..." 
          class="input-pesquisa"
          @input="resetarPagina"
        />
        <button class="btn-pesquisa" @click="pesquisarLivros">
          Pesquisar
        </button>
      </div>
      <div v-if="termoPesquisa && livrosFiltrados.length > 0" class="resultado-pesquisa">
        Encontrado(s) {{ livrosFiltrados.length }} livro(s) para "{{ termoPesquisa }}"
      </div>
      <div v-else-if="termoPesquisa && livrosFiltrados.length === 0" class="resultado-pesquisa nenhum">
        Nenhum livro encontrado para "{{ termoPesquisa }}"
      </div>
    </section>

    <!-- Lista de livros com paginação -->
    <div class="livros-container">
      <BooksList 
        :books="livrosFiltrados"
        :current-page="paginaAtual"
        :books-per-page="livrosPorPagina"
        @page-change="irParaPagina"
        @view="abrirModal"
        @edit="abrirModalEdicao"
        @delete="confirmarExclusao"
        ref="booksListRef"
      />

      <!-- Modal de detalhes do livro -->
      <BookDetailsModal
        v-if="modalAberto"
        :book="livroSelecionado"
        @close="fecharModal"
      />

      <!-- Modal de cadastro/edição de livro -->
      <BookFormModal
        v-if="modalCadastroAberto"
        :book="novoLivro"
        :is-editing="false"
        :loading="cadastrando"
        :message="mensagem"
        @submit="cadastrarLivro"
        @cancel="fecharModalCadastro"
      />

      <!-- Modal de edição de livro -->
      <BookFormModal
        v-if="modalEdicaoAberto"
        :book="livroEditando"
        :is-editing="true"
        :loading="editando"
        :message="mensagem"
        @submit="salvarEdicao"
        @cancel="fecharModalEdicao"
      />

      <!-- Modal de confirmação de exclusão -->
      <DeleteConfirmationModal
        v-if="modalExclusaoAberto"
        :book="livroExcluindo"
        :loading="excluindo"
        @confirm="excluirLivro"
        @cancel="cancelarExclusao"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BookService, AuthService } from '@/services/api';
import BooksList from '@/components/book/BooksList.vue';
import BookDetailsModal from '@/components/book/BookDetailsModal.vue';
import BookFormModal from '@/components/book/BookFormModal.vue';
import DeleteConfirmationModal from '@/components/book/DeleteConfirmationModal.vue';

// Referência para o componente BooksList
const booksListRef = ref(null);

// Estado para os modais
const modalAberto = ref(false);
const livroSelecionado = ref(null);

function abrirModal(book) {
  if (booksListRef.value) {
    booksListRef.value.stopZoomAnimation();
  }
  livroSelecionado.value = book;
  modalAberto.value = true;
}

function fecharModal() {
  modalAberto.value = false;
  livroSelecionado.value = null;
  if (booksListRef.value) {
    booksListRef.value.startZoomAnimation();
  }
}

const router = useRouter();
const books = ref([]);
const loading = ref(false);
const error = ref(null);
const paginaAtual = ref(0);
const livrosPorPagina = 3;

const fetchBooks = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await BookService.getAllBooks();
    books.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar os livros.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBooks();
});

// Variáveis para pesquisa
const termoPesquisa = ref('');
const livrosFiltrados = computed(() => {
  if (!termoPesquisa.value) return books.value;
  
  const termo = termoPesquisa.value.toLowerCase();
  
  return books.value.filter(book => 
    book.title.toLowerCase().includes(termo) || 
    (book.author && book.author.toLowerCase().includes(termo)) || 
    String(book.year_of_publication).includes(termo)
  );
});

// Resetar a página atual quando pesquisar
function resetarPagina() {
  paginaAtual.value = 0;
}

// Função explícita para pesquisar (para o botão)
function pesquisarLivros() {
  resetarPagina();
}

// Navegação de páginas
function irParaPagina(idx) {
  paginaAtual.value = idx;
}

// Função de logout
const handleLogout = async () => {
  try {
    await AuthService.logout();
    localStorage.removeItem('token');
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    localStorage.removeItem('token');
    router.push('/');
  }
};

// Variáveis para o modal de cadastro
const modalCadastroAberto = ref(false);
const cadastrando = ref(false);
const mensagem = ref(null);
const novoLivro = ref({
  title: '',
  author: '',
  number_of_pages: null,
  publication_date: '',
  image_url: ''
});

// Função para abrir o modal de cadastro
function abrirModalCadastro() {
  if (booksListRef.value) {
    booksListRef.value.stopZoomAnimation();
  }
  modalCadastroAberto.value = true;
  // Reset do formulário
  novoLivro.value = {
    title: '',
    author: '',
    number_of_pages: null,
    publication_date: '',
    image_url: ''
  };
  mensagem.value = null;
}

// Função para fechar o modal de cadastro
function fecharModalCadastro() {
  modalCadastroAberto.value = false;
  if (booksListRef.value) {
    booksListRef.value.startZoomAnimation();
  }
}

// Função para cadastrar um novo livro
async function cadastrarLivro(formData) {
  try {
    cadastrando.value = true;
    mensagem.value = null;
    
    // Verificar se a data foi preenchida
    if (!formData.publication_date) {
      mensagem.value = {
        tipo: 'error',
        texto: 'Por favor, selecione a data de publicação.'
      };
      cadastrando.value = false;
      return;
    }
    
    // Preparar os dados para enviar à API
    const livroData = {
      title: formData.title,
      author: formData.author,
      number_of_pages: Number(formData.number_of_pages),
      year_of_publication: formData.publication_date,
      image_url: formData.image_url || ''
    };
    
    // Enviar dados para a API
    await BookService.createBook(livroData);
    
    // Mostrar mensagem de sucesso
    mensagem.value = {
      tipo: 'success',
      texto: 'Livro cadastrado com sucesso!'
    };
    
    // Atualizar a lista de livros
    await fetchBooks();
    
    // Fechar o modal após 2 segundos
    setTimeout(() => {
      fecharModalCadastro();
    }, 2000);
    
  } catch (error) {
    console.error('Erro ao cadastrar livro:', error);
    mensagem.value = {
      tipo: 'error',
      texto: error.response?.data?.error || 'Erro ao cadastrar livro. Tente novamente.'
    };
  } finally {
    cadastrando.value = false;
  }
}

// Variáveis para edição de livro
const modalEdicaoAberto = ref(false);
const editando = ref(false);
const livroEditando = ref({});

// Função para abrir o modal de edição
function abrirModalEdicao(book) {
  if (booksListRef.value) {
    booksListRef.value.stopZoomAnimation();
  }
  modalEdicaoAberto.value = true;
  
  // Formatar a data para o input date (se existir)
  let formattedDate = '';
  if (book.year_of_publication) {
    // Se for apenas um ano, transformar em data completa (primeiro dia do ano)
    if (book.year_of_publication.toString().length === 4) {
      formattedDate = `${book.year_of_publication}-01-01`;
    } else {
      formattedDate = book.year_of_publication;
    }
  }
  
  // Copiar os dados do livro para o formulário de edição
  livroEditando.value = {
    id: book.id,
    title: book.title || '',
    author: book.author || '',
    number_of_pages: book.number_of_pages || null,
    publication_date: formattedDate,
    image_url: book.image_url || ''
  };
  
  mensagem.value = null;
}

// Função para fechar o modal de edição
function fecharModalEdicao() {
  modalEdicaoAberto.value = false;
  if (booksListRef.value) {
    booksListRef.value.startZoomAnimation();
  }
}

// Função para salvar as alterações do livro
async function salvarEdicao(formData) {
  try {
    editando.value = true;
    mensagem.value = null;
    
    // Verificar se a data foi preenchida
    if (!formData.publication_date) {
      mensagem.value = {
        tipo: 'error',
        texto: 'Por favor, selecione a data de publicação.'
      };
      editando.value = false;
      return;
    }
    
    // Preparar os dados para enviar à API
    const livroData = {
      title: formData.title,
      author: formData.author,
      number_of_pages: Number(formData.number_of_pages),
      year_of_publication: formData.publication_date,
      image_url: formData.image_url || ''
    };
    
    // Enviar dados para a API
    await BookService.updateBook(livroEditando.value.id, livroData);
    
    // Mostrar mensagem de sucesso
    mensagem.value = {
      tipo: 'success',
      texto: 'Livro atualizado com sucesso!'
    };
    
    // Atualizar a lista de livros
    await fetchBooks();
    
    // Fechar o modal após 2 segundos
    setTimeout(() => {
      fecharModalEdicao();
    }, 2000);
    
  } catch (error) {
    console.error('Erro ao editar livro:', error);
    mensagem.value = {
      tipo: 'error',
      texto: error.response?.data?.error || 'Erro ao atualizar o livro. Tente novamente.'
    };
  } finally {
    editando.value = false;
  }
}

// Variáveis para exclusão de livro
const modalExclusaoAberto = ref(false);
const excluindo = ref(false);
const livroExcluindo = ref(null);

// Função para abrir o modal de confirmação de exclusão
function confirmarExclusao(book) {
  if (booksListRef.value) {
    booksListRef.value.stopZoomAnimation();
  }
  modalExclusaoAberto.value = true;
  livroExcluindo.value = book;
}

// Função para cancelar a exclusão
function cancelarExclusao() {
  modalExclusaoAberto.value = false;
  livroExcluindo.value = null;
  if (booksListRef.value) {
    booksListRef.value.startZoomAnimation();
  }
}

// Função para excluir o livro
async function excluirLivro() {
  try {
    excluindo.value = true;
    await BookService.deleteBook(livroExcluindo.value.id);
    
    // Atualizar a lista de livros
    await fetchBooks();
    
    // Fechar o modal
    modalExclusaoAberto.value = false;
    livroExcluindo.value = null;
    
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    alert('Erro ao excluir o livro. Tente novamente.');
  } finally {
    excluindo.value = false;
    if (booksListRef.value) {
      booksListRef.value.startZoomAnimation();
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tilt+Warp:wght@400&family=Urbanist:wght@400;500&display=swap');

.homebook-root {
  width: 100vw;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* Cabeçalho */
.header {
  width: 100%;
  background: #fff;
  margin: 0;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 0 48px;
  height: 80px;
}
.logo-arara {
  height: 56px;
  width: auto;
}
.nav-menu {
  display: flex;
  gap: 32px;
}
.nav-btn {
  background: none;
  border: none;
  font-family: 'Urbanist', sans-serif;
  font-weight: 400;
  font-size: 1.25rem;
  color: #535F6A;
  cursor: pointer;
  padding: 0 8px;
  transition: color 0.2s;
}
.nav-btn:hover {
  color: #2c3e50;
}

/* Apresentação */
.apresentacao-container {
  width: 100vw;
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.efeito-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/efeito-bg.png') center/cover no-repeat;
  z-index: 1;
}
.apresentacao-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}
.apresentacao-text {
  font-family: 'Tilt Warp', cursive;
  font-size: 2rem;
  color: #535F6A;
  text-align: center;
  max-width: 100%;
}

/* Barra de pesquisa */
.pesquisa-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pesquisa-box {
  display: flex;
  width: 100%;
}

.input-pesquisa {
  flex: 1;
  padding: 12px 16px;
  font-family: 'Urbanist', sans-serif;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px 0 0 8px;
  outline: none;
}

.btn-pesquisa {
  padding: 12px 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: 1rem;
  background: #90A7BB;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-pesquisa:hover {
  background: #7c97ad;
}

.resultado-pesquisa {
  font-family: 'Urbanist', sans-serif;
  color: #535F6A;
  margin-top: 12px;
}

.resultado-pesquisa.nenhum {
  color: #f44336;
}

/* Container de livros */
.livros-container {
  width: 100vw;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0 0 0;
  margin: 0;
  flex: 1;
}

/* Media queries aprimoradas */
@media (max-width: 1024px) {
  .header-content {
    padding: 0 24px;
  }
  
  .apresentacao-text {
    font-size: 1.8rem;
  }
}

@media (max-width: 900px) {
  .header-content {
    padding: 0 16px;
  }
  
  .logo-arara {
    height: 48px;
  }
  
  .nav-btn {
    font-size: 1.1rem;
  }
  
  .apresentacao-text {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .apresentacao-container {
    height: 140px;
  }
  
  .apresentacao-text {
    font-size: 1.4rem;
  }
  
  .nav-menu {
    gap: 16px;
  }
  
  .pesquisa-container {
    padding: 16px;
  }
  
  .input-pesquisa, .btn-pesquisa {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .header-content {
    padding: 0 12px;
    height: 70px;
  }
  
  .logo-arara {
    height: 40px;
  }
  
  .nav-btn {
    font-size: 1rem;
    padding: 0 5px;
  }
  
  .apresentacao-container {
    height: 120px;
  }
  
  .apresentacao-text {
    font-size: 1.2rem;
  }
  
  .pesquisa-container {
    padding: 12px;
  }
  
  .resultado-pesquisa {
    font-size: 0.9rem;
  }
}

@media (max-width: 400px) {
  .header-content {
    padding: 0 8px;
  }
  
  .nav-menu {
    gap: 10px;
  }
  
  .logo-arara {
    height: 36px;
  }
  
  .nav-btn {
    font-size: 0.9rem;
  }
  
  .apresentacao-container {
    height: 100px;
  }
  
  .apresentacao-text {
    font-size: 1rem;
  }
  
  .btn-pesquisa {
    padding: 10px 12px;
  }
}
</style>