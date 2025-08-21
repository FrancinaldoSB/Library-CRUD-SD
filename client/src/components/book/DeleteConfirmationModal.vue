<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content confirmacao">
  <h2 class="modal-title">Confirmar exclusão</h2>
      <p>Tem certeza que deseja excluir o livro "{{ book?.title }}"?</p>
      <div class="form-buttons">
        <button @click="$emit('confirm')" class="modal-fechar excluir-btn" :disabled="loading">
          {{ loading ? 'Excluindo...' : 'Sim, excluir' }}
        </button>
        <button @click="$emit('cancel')" class="modal-fechar cancelar-btn">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['confirm', 'cancel']);
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
  padding: 40px 48px;
  min-width: 420px;
  max-width: 90vw;
  animation: fadeInModal 0.25s cubic-bezier(.4,0,.2,1);
}

@keyframes fadeInModal {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-content.confirmacao {
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.modal-title {
  font-family: 'Tilt Warp', cursive;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1E1E1E;
  text-align: center;
  width: 100%;
  margin-bottom: 8px;
}

.modal-content.confirmacao p {
  margin: 15px 0 20px;
  font-family: 'Urbanist', sans-serif;
  color: #535F6A;
}

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
  margin-top: 20px;
}

.modal-fechar {
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

.excluir-btn {
  background: #90A7BB;
  color: #fff;
  margin-right: 10px;
  margin-top: 0;
}

.excluir-btn:hover:not(:disabled) {
  background: #DB4437;
  color: #fff;
}

.cancelar-btn {
  background: #90A7BB;
  color: #fff;
}
.cancelar-btn:hover {
  background: #7c97ad;
}

.modal-fechar:hover {
  background: #2c3e50;
}
</style>
