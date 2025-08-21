<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h2>{{ isEditing ? 'Editar Livro' : 'Cadastrar Novo Livro' }}</h2>
      
      <div v-if="message" :class="['alert', message.type]">
        {{ message.text }}
      </div>
      
      <form @submit.prevent="submitForm" class="form-cadastro">
        <div class="form-group">
          <label for="titulo">Título:</label>
          <input 
            id="titulo" 
            v-model="formData.title" 
            type="text" 
            required 
            placeholder="Digite o título do livro"
          />
        </div>
        
        <div class="form-group">
          <label for="autor">Autor:</label>
          <input 
            id="autor" 
            v-model="formData.author" 
            type="text" 
            required 
            placeholder="Digite o nome do autor"
          />
        </div>
        
        <div class="form-group">
          <label for="paginas">Número de Páginas:</label>
          <input 
            id="paginas" 
            v-model="formData.number_of_pages" 
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
            v-model="formData.publication_date" 
            type="date" 
            required 
            placeholder="Selecione a data de publicação"
          />
        </div>
        
        <div class="form-group">
          <label for="imagem">URL da Imagem:</label>
          <input 
            id="imagem" 
            v-model="formData.image_url" 
            type="url" 
            placeholder="Digite a URL da imagem de capa (opcional)"
          />
        </div>
        
        <div class="form-buttons">
          <button type="submit" class="modal-fechar cadastrar-btn" :disabled="loading">
            {{ loading ? (isEditing ? 'Salvando...' : 'Cadastrando...') : (isEditing ? 'Salvar Alterações' : 'Cadastrar Livro') }}
          </button>
          <button type="button" class="modal-fechar cancelar-btn" @click="$emit('cancel')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    default: () => ({
      title: '',
      author: '',
      number_of_pages: null,
      publication_date: '',
      image_url: ''
    })
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  message: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  title: '',
  author: '',
  number_of_pages: null,
  publication_date: '',
  image_url: ''
});

// Inicializa o formulário com os dados do livro quando disponíveis
onMounted(() => {
  if (props.book) {
    formData.value = { ...props.book };
  }
});

// Atualiza o formulário quando o livro muda
watch(() => props.book, (newBook) => {
  if (newBook) {
    formData.value = { ...newBook };
  }
}, { deep: true });

function submitForm() {
  emit('submit', { ...formData.value });
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
  padding: 40px 48px;
  min-width: 420px;
  max-width: 90vw;
  animation: fadeInModal 0.25s cubic-bezier(.4,0,.2,1);
}

@keyframes fadeInModal {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

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

.cadastrar-btn {
  background: #90A7BB;
  margin-right: 10px;
  margin-top: 0;
}

.cancelar-btn {
  background: #c0c0c0;
  margin-top: 0;
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

.modal-fechar:hover {
  background: #2c3e50;
}
</style>
