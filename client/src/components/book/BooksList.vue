<template>
  <section class="livros-container">
    <div class="livros-header">
      <span class="pagina-indicador">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
    </div>
    <div class="livros-navegacao">
      <div class="livros-list">
        <div 
          v-for="(book, idx) in booksOnPage" 
          :key="book.id" 
          class="livro-card" 
          :class="{ 'zoom-anim': idx === zoomIndex }"
        >
          <img @click="$emit('view', book)" :src="book.image_url || 'https://via.placeholder.com/150x200?text=Sem+Imagem'" :alt="book.title" class="livro-capa" />
          <div class="livro-actions">
            <button @click="$emit('edit', book)" class="icon-btn edit-btn" title="Editar livro">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
            <button @click="$emit('delete', book)" class="icon-btn delete-btn" title="Excluir livro">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="livros-circulos-navegacao">
      <button class="arrow-btn left" @click="prevPage" :disabled="currentPage === 0">
        <img src="@/assets/arrow.png" alt="Anterior" class="arrow-img left" />
      </button>
      <div class="livros-circulos">
        <span 
          v-for="idx in 5" 
          :key="idx-1" 
          class="circulo" 
          :class="{ ativo: idx-1 === currentPage }" 
          @click="goToPage(idx-1)"
        >
          <span class="circulo-num">{{ idx }}</span>
        </span>
      </div>
      <button class="arrow-btn right" @click="nextPage" :disabled="currentPage === totalPages - 1">
        <img src="@/assets/arrow.png" alt="Próxima" class="arrow-img right" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  books: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    default: 0
  },
  booksPerPage: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['page-change', 'view', 'edit', 'delete']);

const zoomIndex = ref(0);
let zoomInterval = null;

// Métodos de paginação
function nextPage() {
  if (props.currentPage < totalPages.value - 1) {
    emit('page-change', props.currentPage + 1);
  }
}

function prevPage() {
  if (props.currentPage > 0) {
    emit('page-change', props.currentPage - 1);
  }
}

function goToPage(idx) {
  emit('page-change', idx);
}

// Computed para calcular o total de páginas
const totalPages = computed(() => Math.ceil(props.books.length / props.booksPerPage));

// Computed para calcular os livros da página atual
const booksOnPage = computed(() => {
  const start = props.currentPage * props.booksPerPage;
  return props.books.slice(start, start + props.booksPerPage);
});

// Funções para o efeito de zoom
function startZoomAnimation() {
  stopZoomAnimation();
  zoomInterval = setInterval(() => {
    if (booksOnPage.value.length > 0) {
      zoomIndex.value = (zoomIndex.value + 1) % booksOnPage.value.length;
    }
  }, 10000);
}

function stopZoomAnimation() {
  if (zoomInterval) {
    clearInterval(zoomInterval);
    zoomInterval = null;
  }
}

// Lifecycle hooks para iniciar/parar a animação
onMounted(() => {
  startZoomAnimation();
});

onUnmounted(() => {
  stopZoomAnimation();
});

// Reiniciar a animação quando a página mudar
watch(() => props.currentPage, () => {
  zoomIndex.value = 0;
  startZoomAnimation();
});

defineExpose({
  startZoomAnimation,
  stopZoomAnimation
});
</script>

<style scoped>
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
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, transform 0.2s;
}

.livro-card:hover {
  box-shadow: 0 4px 16px rgba(83,95,106,0.18);
  transform: translateY(-4px) scale(1.03);
}

.livro-capa {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
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

.livros-circulos-navegacao {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin: 32px auto 0 auto;
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 2;
}
.livros-circulos {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.arrow-btn.left, .arrow-btn.right {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: filter 0.2s;
}
.arrow-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.arrow-img.left, .arrow-img.right {
  width: 28px;
  height: 28px;
}

.circulo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Urbanist', sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: #535F6A;
  user-select: none;
}
.circulo.ativo {
  background: #535F6A;
  color: #fff;
}
.circulo-num {
  display: block;
  width: 100%;
  text-align: center;
}

.circulo.ativo {
  background: #535F6A;
}

.arrow-btn:disabled .arrow-img {
  opacity: 0.3;
  cursor: not-allowed;
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

@media (max-width: 900px) {
  .livros-header {
    padding: 0 16px;
  }
  
  .livros-list {
    gap: 16px;
  }
}
</style>
