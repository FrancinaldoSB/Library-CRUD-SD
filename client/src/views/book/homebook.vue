<template>
  <div class="homebook-root">
    <!-- Cabeçalho -->
    <header class="header">
      <div class="header-content">
        <img src="@/assets/arara.png" alt="Logo Arara" class="logo-arara" />
        <nav class="nav-menu">
          <button class="nav-btn" @click="goTo('cadastro')">Cadastrar</button>
          <button class="nav-btn" @click="goTo('buscar')">Buscar</button>
          <button class="nav-btn" @click="goTo('editar')">Editar</button>
          <button class="nav-btn" @click="goTo('excluir')">Excluir</button>
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
          <div v-for="(book, idx) in livrosPagina" :key="book.id" class="livro-card" :class="{ 'zoom-anim': idx === zoomIndex }" @click="abrirModal(book)">
            <img :src="book.image_url || 'https://via.placeholder.com/150x200?text=Sem+Imagem'" :alt="book.title" class="livro-capa" />
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
  </div>
</template>

<script setup>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { BookService, AuthService } from '@/services/api';

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

const totalPaginas = computed(() => Math.ceil(books.value.length / livrosPorPagina));
const livrosPagina = computed(() => {
  const start = paginaAtual.value * livrosPorPagina;
  return books.value.slice(start, start + livrosPorPagina);
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
  if (action === 'editar') router.push('/editar');
  if (action === 'excluir') router.push('/excluir');
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
</style>