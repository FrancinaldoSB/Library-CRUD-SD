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

    <!-- Livros -->
    <section class="livros-container">
      <div class="livros-header">
        <span class="pagina-indicador">Página {{ paginaAtual + 1 }} de {{ totalPaginas }}</span>
      </div>
      <div class="livros-navegacao">
        <button class="arrow-btn left" @click="paginaAnterior" :disabled="paginaAtual === 0">
          <img src="@/assets/arrow.png" alt="Anterior" class="arrow-img left" />
        </button>
        <div class="livros-list">
          <div v-for="(book, idx) in livrosPagina" :key="book.id" class="livro-card" :class="{ 'zoom-anim': idx === zoomIndex }">
            <img @click="abrirModal(book)" :src="book.image_url || 'https://via.placeholder.com/150x200?text=Sem+Imagem'" :alt="book.title" class="livro-capa" />
            <div class="livro-actions">
              <button @click="abrirModalEdicao(book)" class="icon-btn edit-btn" title="Editar livro">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </button>
              <button @click="confirmarExclusao(book)" class="icon-btn delete-btn" title="Excluir livro">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
  <!-- Modal de detalhes do livro -->
  <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
    <div class="modal-content">
      <img :src="livroSelecionado?.image_url || 'https://via.placeholder.com/150x200?text=Sem+Imagem'" :alt="livroSelecionado?.title" class="modal-capa" />
      <div class="modal-info">
        <h2>{{ livroSelecionado?.title }}</h2>
        <p><strong>Autor:</strong> {{ livroSelecionado?.author }}</p>
        <p><strong>Páginas:</strong> {{ livroSelecionado?.number_of_pages }}</p>
        <p><strong>Ano:</strong> {{ livroSelecionado?.year_of_publication }}</p>
        <button class="modal-fechar" @click="fecharModal">Fechar</button>
      </div>
    </div>
  </div>
        </div>
        <button class="arrow-btn right" @click="proximaPagina" :disabled="paginaAtual === totalPaginas - 1">
          <img src="@/assets/arrow.png" alt="Próxima" class="arrow-img right" />
        </button>
      </div>
      <div class="livros-circulos">
        <span v-for="(p, idx) in totalPaginas" :key="idx" class="circulo" :class="{ ativo: idx === paginaAtual }" @click="irParaPagina(idx)"></span>
      </div>
    </section>

    <!-- Modal de cadastro de livro -->
    <div v-if="modalCadastroAberto" class="modal-overlay" @click.self="fecharModalCadastro">
      <div class="modal-content">
        <h2>Cadastrar Novo Livro</h2>
        
        <div v-if="mensagem" :class="['alert', mensagem.tipo]">
          {{ mensagem.texto }}
        </div>
        
        <form @submit.prevent="cadastrarLivro" class="form-cadastro">
          <div class="form-group">
            <label for="titulo">Título:</label>
            <input 
              id="titulo" 
              v-model="novoLivro.title" 
              type="text" 
              required 
              placeholder="Digite o título do livro"
            />
          </div>
          
          <div class="form-group">
            <label for="autor">Autor:</label>
            <input 
              id="autor" 
              v-model="novoLivro.author" 
              type="text" 
              required 
              placeholder="Digite o nome do autor"
            />
          </div>
          
          <div class="form-group">
            <label for="paginas">Número de Páginas:</label>
            <input 
              id="paginas" 
              v-model="novoLivro.number_of_pages" 
              type="number" 
              min="1" 
              required 
              placeholder="Digite o número de páginas"
            />
          </div>
          
          <div class="form-group">
            <label for="data">Data de Publicação:</label>
            <input 
              id="data" 
              v-model="novoLivro.publication_date" 
              type="date" 
              required 
              placeholder="Selecione a data de publicação"
            />
          </div>
          
          <div class="form-group">
            <label for="imagem">URL da Imagem:</label>
            <input 
              id="imagem" 
              v-model="novoLivro.image_url" 
              type="url" 
              placeholder="Digite a URL da imagem de capa (opcional)"
            />
          </div>
          
          <div class="form-buttons">
            <button type="submit" class="modal-fechar cadastrar-btn" :disabled="cadastrando">
              {{ cadastrando ? 'Cadastrando...' : 'Cadastrar Livro' }}
            </button>
            <button type="button" class="modal-fechar cancelar-btn" @click="fecharModalCadastro">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal de edição de livro -->
    <div v-if="modalEdicaoAberto" class="modal-overlay" @click.self="fecharModalEdicao">
      <div class="modal-content">
        <h2>Editar Livro</h2>
        
        <div v-if="mensagem" :class="['alert', mensagem.tipo]">
          {{ mensagem.texto }}
        </div>
        
        <form @submit.prevent="salvarEdicao" class="form-cadastro">
          <div class="form-group">
            <label for="titulo-edicao">Título:</label>
            <input 
              id="titulo-edicao" 
              v-model="livroEditando.title" 
              type="text" 
              required 
              placeholder="Digite o título do livro"
            />
          </div>
          
          <div class="form-group">
            <label for="autor-edicao">Autor:</label>
            <input 
              id="autor-edicao" 
              v-model="livroEditando.author" 
              type="text" 
              required 
              placeholder="Digite o nome do autor"
            />
          </div>
          
          <div class="form-group">
            <label for="paginas-edicao">Número de Páginas:</label>
            <input 
              id="paginas-edicao" 
              v-model="livroEditando.number_of_pages" 
              type="number" 
              min="1" 
              required 
              placeholder="Digite o número de páginas"
            />
          </div>
          
          <div class="form-group">
            <label for="data-edicao">Data de Publicação:</label>
            <input 
              id="data-edicao" 
              v-model="livroEditando.publication_date" 
              type="date" 
              required 
              placeholder="Selecione a data de publicação"
            />
          </div>
          
          <div class="form-group">
            <label for="imagem-edicao">URL da Imagem:</label>
            <input 
              id="imagem-edicao" 
              v-model="livroEditando.image_url" 
              type="url" 
              placeholder="Digite a URL da imagem de capa (opcional)"
            />
          </div>
          
          <div class="form-buttons">
            <button type="submit" class="modal-fechar cadastrar-btn" :disabled="editando">
              {{ editando ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
            <button type="button" class="modal-fechar cancelar-btn" @click="fecharModalEdicao">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal de confirmação de exclusão -->
    <div v-if="modalExclusaoAberto" class="modal-overlay" @click.self="cancelarExclusao">
      <div class="modal-content confirmacao">
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que deseja excluir o livro "{{ livroExcluindo?.title }}"?</p>
        <div class="form-buttons">
          <button @click="excluirLivro" class="modal-fechar excluir-btn" :disabled="excluindo">
            {{ excluindo ? 'Excluindo...' : 'Sim, Excluir' }}
          </button>
          <button @click="cancelarExclusao" class="modal-fechar cancelar-btn">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { BookService, AuthService } from '@/services/api';

const modalAberto = ref(false);
const livroSelecionado = ref(null);
const zoomIndex = ref(0);
let zoomInterval = null;

function abrirModal(book) {
  pararAnimacaoZoom();
  livroSelecionado.value = book;
  modalAberto.value = true;
}
function fecharModal() {
  modalAberto.value = false;
  livroSelecionado.value = null;
  iniciarAnimacaoZoom();
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
  iniciarAnimacaoZoom();
});

onUnmounted(() => {
  pararAnimacaoZoom();
});

function iniciarAnimacaoZoom() {
  pararAnimacaoZoom();
  zoomInterval = setInterval(() => {
    if (livrosPagina.value.length > 0) {
      zoomIndex.value = (zoomIndex.value + 1) % livrosPagina.value.length;
    }
  }, 10000);
}

function pararAnimacaoZoom() {
  if (zoomInterval) {
    clearInterval(zoomInterval);
    zoomInterval = null;
  }
}

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
  // O filtro já acontece automaticamente pelo computed property
}

// Modificar o cálculo de páginas e livros por página para usar os resultados filtrados
const totalPaginas = computed(() => Math.ceil(livrosFiltrados.value.length / livrosPorPagina));
const livrosPagina = computed(() => {
  const start = paginaAtual.value * livrosPorPagina;
  return livrosFiltrados.value.slice(start, start + livrosPorPagina);
});

function proximaPagina() {
  if (paginaAtual.value < totalPaginas.value - 1) paginaAtual.value++;
}
function paginaAnterior() {
  if (paginaAtual.value > 0) paginaAtual.value--;
}
function irParaPagina(idx) {
  paginaAtual.value = idx;
}

function goTo(action) {
  // Navegação fictícia, ajuste conforme rotas reais
  if (action === 'cadastro') router.push('/user/cadastro');
  if (action === 'buscar') router.push('/buscar');
}

// Função de logout
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

// Variáveis para o modal de cadastro
const modalCadastroAberto = ref(false);
const cadastrando = ref(false);
const mensagem = ref(null);
const novoLivro = ref({
  title: '',
  author: '',
  number_of_pages: null,
  publication_date: '',  // Alterado de year_of_publication para publication_date
  image_url: ''
});

// Função para abrir o modal de cadastro
function abrirModalCadastro() {
  pararAnimacaoZoom();
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
  iniciarAnimacaoZoom();
}

// Função para cadastrar um novo livro
async function cadastrarLivro() {
  try {
    cadastrando.value = true;
    mensagem.value = null;
    
    // Verificar se a data foi preenchida
    if (!novoLivro.value.publication_date) {
      mensagem.value = {
        tipo: 'error',
        texto: 'Por favor, selecione a data de publicação.'
      };
      cadastrando.value = false;
      return;
    }
    
    // Preparar os dados para enviar à API usando o formato esperado pelo servidor
    const livroData = {
      title: novoLivro.value.title,
      author: novoLivro.value.author,
      number_of_pages: Number(novoLivro.value.number_of_pages),
      // Enviar a data completa no formato que o banco de dados espera (AAAA-MM-DD)
      year_of_publication: novoLivro.value.publication_date,
      image_url: novoLivro.value.image_url || ''
    };
    
    console.log('Enviando dados para API:', livroData);
    
    // Enviar dados para a API
    const response = await BookService.createBook(livroData);
    
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
const livroEditando = ref({
  id: null,
  title: '',
  author: '',
  number_of_pages: null,
  publication_date: '',
  image_url: ''
});

// Função para abrir o modal de edição
function abrirModalEdicao(book) {
  pararAnimacaoZoom();
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
  iniciarAnimacaoZoom();
}

// Função para salvar as alterações do livro
async function salvarEdicao() {
  try {
    editando.value = true;
    mensagem.value = null;
    
    // Verificar se a data foi preenchida
    if (!livroEditando.value.publication_date) {
      mensagem.value = {
        tipo: 'error',
        texto: 'Por favor, selecione a data de publicação.'
      };
      editando.value = false;
      return;
    }
    
    // Preparar os dados para enviar à API
    const livroData = {
      title: livroEditando.value.title,
      author: livroEditando.value.author,
      number_of_pages: Number(livroEditando.value.number_of_pages),
      year_of_publication: livroEditando.value.publication_date,
      image_url: livroEditando.value.image_url || ''
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
  pararAnimacaoZoom();
  modalExclusaoAberto.value = true;
  livroExcluindo.value = book;
}

// Função para cancelar a exclusão
function cancelarExclusao() {
  modalExclusaoAberto.value = false;
  livroExcluindo.value = null;
  iniciarAnimacaoZoom();
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
    iniciarAnimacaoZoom();
  }
}
</script>

<style scoped>
/* Modal de detalhes do livro */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(30, 36, 44, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInBg 0.2s;
}
@keyframes fadeInBg {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  padding: 40px 48px;
  min-width: 420px;
  max-width: 90vw;
  animation: fadeInModal 0.25s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInModal {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.modal-capa {
  width: 150px;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
}
.modal-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Urbanist', sans-serif;
  color: #535F6A;
}
.modal-info h2 {
  font-size: 1.6rem;
  font-family: 'Tilt Warp', cursive;
  color: #2c3e50;
  margin-bottom: 8px;
}
.modal-fechar {
  margin-top: 18px;
  align-self: flex-end;
  background: #535F6A;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-family: 'Urbanist', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-fechar:hover {
  background: #2c3e50;
}
.livro-card {
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.livro-card:hover {
  box-shadow: 0 4px 16px rgba(83,95,106,0.18);
  transform: translateY(-4px) scale(1.03);
}
.zoom-anim {
  animation: zoomBook 2.5s cubic-bezier(.4,0,.2,1);
  z-index: 1;
}
@keyframes zoomBook {
  0% { transform: scale(1); box-shadow: 0 2px 8px rgba(83,95,106,0.04); }
  40% { transform: scale(1.12); box-shadow: 0 8px 32px rgba(83,95,106,0.18); }
  100% { transform: scale(1); box-shadow: 0 2px 8px rgba(83,95,106,0.04); }
}
@import url('https://fonts.googleapis.com/css2?family=Tilt+Warp:wght@400&family=Urbanist:wght@400;500&display=swap');

.homebook-root {
  width: 100vw;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* Cabeçalho */
.header {
  width: 100vw;
  background: #fff;
  margin: 0;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  width: 100vw;
  height: 100%;
  background: url('@/assets/efeito-bg.png') center/cover no-repeat;
  z-index: 1;
}
.apresentacao-content {
  position: relative;
  z-index: 2;
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.apresentacao-text {
  font-family: 'Tilt Warp', cursive;
  font-size: 2rem;
  color: #535F6A;
  text-align: center;
  width: 100vw;
}

/* Barra de pesquisa */
.pesquisa-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
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

/* Livros */
.livros-container {
  width: 100vw;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0 0 0;
  margin: 0;
}
.livros-header {
  width: 100vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px 48px 0 48px;
}
.pagina-indicador {
  font-family: 'Urbanist', sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  color: #535F6A;
}
.livros-navegacao {
  width: 100vw;
  min-height: 240px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.arrow-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
  min-width: 56px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.arrow-btn.left {
  left: calc(50% - 360px);
}
.arrow-btn.right {
  right: calc(50% - 360px);
}
.arrow-img {
  width: 40px;
  height: 40px;
  user-select: none;
  display: block;
}
.arrow-img.left {
  transform: rotate(180deg);
}
.livros-list {
  display: flex;
  gap: 48px;
  justify-content: center;
  align-items: center;
  min-height: 220px;
  min-width: 480px;
  width: 640px;
  margin: 0 auto;
}
.livro-card {
  width: 150px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.livro-capa {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}
.livros-circulos {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin: 18px 0 24px 0;
}
.circulo {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e0e0e0;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-block;
}
.circulo.ativo {
  background: #535F6A;
}
.arrow-btn:disabled .arrow-img {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .header-content, .livros-header {
    padding: 0 16px;
  }
  .livros-list {
    gap: 16px;
  }
}

/* Estilos para o formulário de cadastro */
.form-cadastro {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.alert.success {
  background-color: #d4edda;
  color: #155724;
}

.alert.error {
  background-color: #f8d7da;
  color: #721c24;
}

/* Ajustes nos botões do formulário de cadastro */
.cadastrar-btn {
  background: #90A7BB;
  margin-right: 10px;
  margin-top: 0;
}

.cancelar-btn {
  background: #c0c0c0;
  margin-top: 0;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* Ajuste na largura do modal de cadastro */
.modal-content {
  max-width: 90vw;
  min-width: 420px;
  width: auto;
}

.form-cadastro {
  width: 100%;
}

/* Estilos para os ícones de edição e exclusão */
.livro-card {
  position: relative;
}

.livro-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  padding: 3px;
  opacity: 0;
  transition: opacity 0.2s;
}

.livro-card:hover .livro-actions {
  opacity: 1;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  color: #4285F4;
}

.delete-btn {
  color: #DB4437;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.excluir-btn {
  background: #DB4437;
}

.excluir-btn:hover:not(:disabled) {
  background: #C53929;
}

.modal-content.confirmacao {
  flex-direction: column;
  align-items: flex-start;
  max-width: 400px;
}

.modal-content.confirmacao p {
  margin: 15px 0 20px;
  font-family: 'Urbanist', sans-serif;
  color: #535F6A;
}
</style>