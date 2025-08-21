<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <img :src="book?.image_url || 'https://via.placeholder.com/150x200?text=Sem+Imagem'" :alt="book?.title" class="modal-capa" />
      <div class="modal-info">
        <h2>{{ book?.title }}</h2>
        <p><strong>Autor:</strong> {{ book?.author }}</p>
        <p><strong>Páginas:</strong> {{ book?.number_of_pages }}</p>
        <p><strong>Ano:</strong> {{ book?.year_of_publication }}</p>
        <button class="modal-fechar" @click="closeModal">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

function closeModal() {
  emit('close');
}
</script>

<style scoped>
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
</style>
